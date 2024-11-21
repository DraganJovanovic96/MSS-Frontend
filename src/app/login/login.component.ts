import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.checkCapsLockStatusOnInit();
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

  onSubmit(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('email')!.value;
      const password = this.loginForm.get('password')!.value;

      this.authService.login(username, password).subscribe(
        (res: HttpResponse<boolean>) => { },
        (error: any) => {
          if (error.status === 403) {
            this.snackBar.open('Account not verified, redirecting to verification page.', 'Close', {
              duration: 10000,
              verticalPosition: 'top'
            });
            this.router.navigate(['/verify']);
          } else {
            this.errorMessage = 'Login failed. Please check your credentials.';
          }
        }
      );
    }
  }
}
