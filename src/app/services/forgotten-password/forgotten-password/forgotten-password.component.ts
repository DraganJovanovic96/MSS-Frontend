import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
const BASIC_URL = environment.apiUrl;

interface AuthResponse {
  message?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ForgottenPasswordComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  passwordVisible = false;
  capsLockOn = false;
  token: string | null = null;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatNewPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.checkCapsLockStatusOnInit();
    this.extractTokenFromQueryParams();
    this.extractEmailFromQueryParams();
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

  extractTokenFromQueryParams(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.router.navigate(['/home']);
    }
  }

  extractEmailFromQueryParams(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
    if (!this.email) {
      this.router.navigate(['/home']);
    }
  }


  onSubmit(): void {
    if (!this.token) {
      this.errorMessage = 'Token is required to reset your password.';
      return;
    }

    if (!this.email) {
      this.errorMessage = 'Email is required to reset your password.';
      return;
    }

    if (this.loginForm.valid) {
      const newPassword = this.loginForm.get('newPassword')!.value;
      const repeatNewPassword = this.loginForm.get('repeatNewPassword')!.value;

      if (newPassword !== repeatNewPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const body = { newPassword, repeatNewPassword };

      const url = `${BASIC_URL}auth/reset-password?token=${encodeURIComponent(this.token)}&email=${encodeURIComponent(this.email)}`;

      this.http
        .post<AuthResponse>(url, body, { headers, observe: 'response' })
        .pipe(
          map((res) => {
            this.authService.fetchUser().subscribe({
              next: () => {
                this.router.navigate(['/dashboard']);
              },
              error: () => {
                this.router.navigate(['/login']);
              }
            });
            return true;
          }),
          catchError((err) => {
            this.errorMessage = 'Failed to reset password. Please try again.';
            return throwError(() => err);
          })
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Password reset successfully', 'Close', { duration: 3000 });
          },
        });
    } else {
      this.errorMessage = 'Form is invalid. Please correct the errors.';
    }
  }
}
