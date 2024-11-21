import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStateService } from '../../../services/auth/token.state.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})

export class EmailVerificationComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  blurredEmail = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private userStorageService: UserStorageService,
    private tokenStateService: TokenStateService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      verification: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onEmailBlur() {
    this.blurredEmail = true;
  }

  onEmailFocus(): void {
    this.blurredEmail = false;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')!.value;
      const verificationCode = this.loginForm.get('verification')!.value;

      const verifyUserDto = {
        email: email,
        verificationCode: verificationCode
      };

      const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', '*/*');

      this.http.post<{ access_token: string; refresh_token: string }>(
        `${BASIC_URL}auth/verification`,
        verifyUserDto,
        { headers, observe: 'response' }
      ).subscribe({
        next: (res) => {
          const accessToken = res.body?.access_token;
          const refreshToken = res.body?.refresh_token;

          if (accessToken) {
            this.userStorageService.saveToken(accessToken);
            this.tokenStateService.reset();
            this.authService.fetchUser(accessToken).subscribe();
          }

          if (refreshToken) {
            this.userStorageService.saveRefreshToken(refreshToken);
            this.tokenStateService.reset();
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Error verifying user:', error);
          this.errorMessage = 'Failed to verify your account. Please try again.';
        }
      });
    }
  }
}
