import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth/auth.service';
import { TokenStateService } from '../../../services/auth/token.state.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { catchError, map, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

const BASIC_URL = environment.apiUrl;


interface AuthResponse {
  body: any;
  access_token: string;
  refresh_token: string;
}

@Component({
  selector: 'app-email-verification',
  standalone: true,
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
  errorMessage: string | null = null;
  token: string | null = null;
  email: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userStorageService: UserStorageService,
    private tokenStateService: TokenStateService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || null;
      this.email = params['email'] || null;

      if (this.token) {
        this.verifyUser(this.token);
      } else {
        this.errorMessage = 'Token is required to verify user.';
      }

      if (!this.email) {
        console.log('Email is missing in the query parameters.');
        this.errorMessage = 'Email is required to verify user.';
      }
    });
  }

  private verifyUser(token: string): void {
    if (!this.token) {
      this.errorMessage = 'Token is required to verify user.';
      return;
    }

    if (!this.email) {
      this.errorMessage = 'Email is required to verify user.';
      return;
    }

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');

    const url = `${BASIC_URL}auth/verification?token=${encodeURIComponent(this.token)}&email=${encodeURIComponent(this.email)}`;

    this.http
      .post<AuthResponse>(url, {}, { headers, observe: 'response' })
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
          this.errorMessage = 'Failed to verify user. Please try again.';
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => {
          this.snackBar.open('User verified successfully', 'Close', { duration: 3000 });
        },
      });
  }
}
