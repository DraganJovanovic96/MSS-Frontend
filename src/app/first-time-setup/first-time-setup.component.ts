import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { UserStorageService } from '../services/storage/user-storage.service';
import { AuthService } from '../services/auth/auth.service';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-first-time-setup',
  standalone: true,
  templateUrl: './first-time-setup.component.html',
  styleUrls: ['./first-time-setup.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})

export class FirstTimeSetupComponent implements OnInit {
  setupForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordVisible = false;
  repeatPasswordVisible = false;
  capsLockOn = false;
  isLoading = false;

  passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private userStorageService: UserStorageService,
    private authService: AuthService
  ) {
    this.setupForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.passwordPattern)]],
      repeatNewPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.passwordPattern)]]
    });
  }

  ngOnInit(): void {
    this.checkCapsLockStatusOnInit();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleRepeatPasswordVisibility(): void {
    this.repeatPasswordVisible = !this.repeatPasswordVisible;
  }

  checkCapsLockStatusOnInit(): void {
    document.addEventListener('keydown', (event) => {
      this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    });
  }

  checkCapsLock(event: KeyboardEvent): void {
    this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
  }

  onSubmit(): void {
    if (this.setupForm.valid) {
      const newPassword = this.setupForm.get('newPassword')!.value;
      const repeatNewPassword = this.setupForm.get('repeatNewPassword')!.value;

      if (newPassword !== repeatNewPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      this.isLoading = true;
      this.errorMessage = null;

      const body = {
        password: '', 
        newPassword: newPassword,
        repeatNewPassword: repeatNewPassword
      };

      this.http.put(`${BASIC_URL}users/change-password`, body, { responseType: 'text' }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Password set successfully! Redirecting to dashboard...';
          this.snackBar.open('Account setup completed successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });

          this.authService.fetchUser().subscribe({
            next: () => {
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1500);
            },
            error: () => {
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1500);
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error response from backend:', error);
          this.errorMessage = error.error?.message || 'Failed to set password. Please try again.';
          this.snackBar.open('Failed to set password. Please try again.', 'Close', {
            duration: 3000,
            verticalPosition: 'bottom'
          });
        },
      });
    }
  }
}