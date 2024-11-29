import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {  Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})

export class ResetPasswordComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  passwordVisible = false;
  capsLockOn = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar) {

    this.loginForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatNewPassword: ['', [Validators.required, Validators.minLength(6)]],
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

  onSubmit(): void {
    if (this.loginForm.valid) {
      const password = this.loginForm.get('password')!.value;
      const newPassword = this.loginForm.get('newPassword')!.value;
      const repeatNewPassword = this.loginForm.get('repeatNewPassword')!.value;

      const body = { password, newPassword, repeatNewPassword };

      this.http.put(`${BASIC_URL}users/change-password`, body, { responseType: 'text' }).subscribe({
        next: (response) => {
          this.snackBar.open(response, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
          });
          this.router.navigate(['/update-user']);
        },
        error: (error) => {
          console.error('Error response from backend:', error);
          this.snackBar.open('Error changing password. Please try again.', 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
          });
        },
      });
    }
  }
}
