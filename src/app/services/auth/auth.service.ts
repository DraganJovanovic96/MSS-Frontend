import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';
import { Router } from '@angular/router';
import { UserStateService } from './user.state.service';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

interface AuthResponse {
  message?: string;
  firstTimeSetup?: boolean;
}

interface UserResponse {
  firstname: string;
  lastname: string;
  imageUrl: string;
  role: string;
  firstTimeSetupCompleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService,
    private userStateService: UserStateService,
    private router: Router
  ) { }

  login(email: string, password: string): any {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    const body = { email, password };
    return this.http.post<AuthResponse>(BASIC_URL + 'auth/authenticate', body, { headers, observe: 'response' }).pipe(
      map((res) => {
        this.fetchUser().subscribe({
          next: (userResponse) => {
            if (userResponse && !userResponse.firstTimeSetupCompleted) {
              this.router.navigate(['/first-time-setup']);
            } else {
              this.router.navigate(['/']);
            }
          },
          error: () => {
            this.router.navigate(['/']);
          }
        });
        return true;
      })
    );
  }

  fetchUser(): Observable<UserResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', '*/*');

    return this.http.get<UserResponse>(BASIC_URL + 'users/user', { headers }).pipe(
      map((res) => {
        if (res) {
          this.userStorageService.saveUser(res);
          this.userStateService.setUserImage(res.imageUrl);
          return res;
        }
        return {} as UserResponse;
      })
    );
  }

  logout(): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post(BASIC_URL + 'auth/logout', {}, { headers }).subscribe({
      next: () => {
        this.userStorageService.clearUser();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.userStorageService.clearUser();
        this.router.navigate(['/login']);
      }
    });
  }

  exchangeOAuth2Code(code: string): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<AuthResponse>(`${BASIC_URL}auth/oauth2/exchange`, { code }, { headers });
  }

  handleOAuth2Login(firstTimeSetup: boolean = false): void {
    setTimeout(() => {
      this.fetchUser().subscribe({
        next: (userResponse) => {
          if (firstTimeSetup || (userResponse && !userResponse.firstTimeSetupCompleted)) {
            this.router.navigate(['/first-time-setup']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Error fetching user after OAuth2 login:', error);
          this.router.navigate(['/']);
        }
      });
    }, 200);
  }

  checkAuth(): Observable<boolean> {
    return this.http.get(BASIC_URL + 'users/user').pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      })
    );
  }
}
