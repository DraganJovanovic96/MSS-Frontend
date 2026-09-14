import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  passwordVisible = false;
  capsLockOn = false;
  blurredEmail = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.checkCapsLockStatusOnInit();
    this.handleOAuth2Callback();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  checkCapsLockStatusOnInit(): void {
    document.addEventListener('keydown', (event) => {
      this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    });
  }


  checkCapsLock(event: KeyboardEvent): void {
    this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
  }

  onEmailBlur() {
    this.blurredEmail = true;
  }

  onEmailFocus(): void {
    this.blurredEmail = false;
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  handleOAuth2Callback(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const error = params['error'];
      const message = params['message'];

      if (error) {
        switch (error) {
          case 'user_not_found':
            this.errorMessage = message || 'No account found with this email. Please contact an administrator to create an account.';
            break;
          case 'account_error':
            this.errorMessage = message || 'Account error occurred during authentication.';
            break;
          case 'authentication_failed':
            this.errorMessage = message || 'Authentication failed. Please try again.';
            break;
          case 'unexpected_error':
            this.errorMessage = message || 'An unexpected error occurred. Please try again.';
            break;
          default:
            this.errorMessage = message || 'Failed to complete authentication';
        }
        return;
      }

      if (code) {
        this.isLoading = true;
        this.exchangeOAuth2Code(code);
      }
    });
  }

  exchangeOAuth2Code(code: string): void {
    this.authService.exchangeOAuth2Code(code).subscribe({
      next: (response) => {
        const firstTimeSetup = response.firstTimeSetup || false;
        this.authService.handleOAuth2Login(firstTimeSetup);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.errorMessage = 'Authorization code already used';
        } else if (error.status === 401 || error.status === 403) {
          const errorMessage = error.error?.message || 'Authentication failed';
          if (errorMessage.includes('not registered')) {
            this.errorMessage = 'User not registered in the system';
          } else if (errorMessage.includes('access denied')) {
            this.errorMessage = 'Access denied';
          } else {
            this.errorMessage = errorMessage;
          }
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid or expired authorization code';
        } else {
          this.errorMessage = 'Failed to complete authentication';
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('email')!.value;
      const password = this.loginForm.get('password')!.value;

      this.authService.login(username, password).subscribe(
        (res: HttpResponse<boolean>) => { },
        (error: any) => {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      );
    }
  }
}
