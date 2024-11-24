import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-resend-verification-email',
  standalone: true,
  templateUrl: './resend-verification-email.component.html',
  styleUrls: ['./resend-verification-email.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})

export class ResendVerificationEmailComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  blurredEmail = false;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
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
  
      const emailRequestDto = {
        email: email
      };
  
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', '*/*');
  
      this.http.post(
        `${BASIC_URL}auth/resend-verification`,
        emailRequestDto,
        { headers, observe: 'response', responseType: 'text' } 
      ).subscribe({
        next: (res) => {
          this.snackBar.open('New verification code has been sent to your email', 'Close', {
            duration: 10000
          });
          this.router.navigate(['/verify']);
        },
        error: (error) => {
          console.error('Error verifying user:', error);
          this.errorMessage = 'Failed to verify your account. Please try again.';
        }
      });
    }
  }
}
