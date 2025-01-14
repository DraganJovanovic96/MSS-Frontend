import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, share } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';
import { Router } from '@angular/router';
import { TokenStateService } from './token.state.service';
import { UserStateService } from './user.state.service';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

interface UserResponse {
  firstname: string;
  lastname: string;
  imageUrl: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private refreshTokenObservable?: Observable<string>;
  private inProgress: boolean = false;

  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService,
    private tokenStateService: TokenStateService,
    private userStateService: UserStateService,
    private router: Router
  ) { }

  login(email: string, password: string): any {
    this.refreshTokenObservable = undefined;
    this.inProgress = false;
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    const body = { email, password };
    return this.http.post<AuthResponse>(BASIC_URL + 'auth/authenticate', body, { headers, observe: 'response' }).pipe(
      map((res) => {
        const token = res.body?.access_token;
        const refresh_token = res.body?.refresh_token;
        if (token) {
          this.userStorageService.saveToken(token);
          this.tokenStateService.reset();
          this.fetchUser(token).subscribe();
        }
        if (refresh_token) {
          this.userStorageService.saveRefreshToken(refresh_token);
          this.tokenStateService.reset();
          this.router.navigate(['/']);
          return true;
        }
        return false;
      })
    );
  }

  fetchUser(token: string): Observable<void> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<UserResponse>(BASIC_URL + 'users/user', { headers }).pipe(
      map((res) => {
        if (res) {
          this.userStorageService.saveUser(res);
          this.userStateService.setUserImage(res.imageUrl);
        }
      })
    );
  }

  refreshToken(): Observable<string> {
    if (this.refreshTokenObservable && this.inProgress) {
      return this.refreshTokenObservable;
    }

    this.inProgress = true;
    const refreshToken = this.userStorageService.getRefreshToken();
    const headers = new HttpHeaders().set('Refresh', `Bearer ${refreshToken}`);

    this.refreshTokenObservable = this.http.post<AuthResponse>(`${BASIC_URL}auth/refresh-token`, {}, { headers }).pipe(
      share(),
      map((res) => {
        if (res.access_token) {
          this.userStorageService.saveToken(res.access_token);
          this.inProgress = false;
          return res.access_token;
        }
        throw new Error('Failed to refresh token');
      }),
      catchError((err) => {
        this.inProgress = false;
        throw err;
      })
    );

    return this.refreshTokenObservable;
  }

  logout(): void {
    this.tokenStateService.reset();
    this.userStorageService.clearTokens();
    this.userStorageService.clearUser();
  }

  public createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.userStorageService.getToken());
  }
}
