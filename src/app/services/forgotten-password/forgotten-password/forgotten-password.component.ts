import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../../storage/user-storage.service';
import { TokenStateService } from '../../auth/token.state.service';
import { UserStateService } from '../../auth/user.state.service';
import { Observable, catchError, map, throwError } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/api/v1/';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private userStorageService: UserStorageService,
    private tokenStateService: TokenStateService,
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

  onSubmit(): void {
    if (!this.token) {
      this.errorMessage = 'Token is required to reset your password.';
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

      const url = `${BASIC_URL}auth/reset-password?token=${encodeURIComponent(this.token)}`;

      this.http
        .post<AuthResponse>(url, body, { headers, observe: 'response' })
        .pipe(
          map((res) => {
            const token = res.body?.access_token;
            const refresh_token = res.body?.refresh_token;
            if (token) {
              this.userStorageService.saveToken(token);
              this.tokenStateService.reset();
              this.authService.fetchUser(token).subscribe();
            }
            if (refresh_token) {
              this.userStorageService.saveRefreshToken(refresh_token);
              this.tokenStateService.reset();
              this.router.navigate(['/dashboard']);
            }
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
