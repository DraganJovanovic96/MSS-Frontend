import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  private tokenKey = 'auth-token';
  private refreshTokenKey = 'refresh-token';
  private USER = 'mss-user';

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public saveUser(user: Object): void {
    window.localStorage.removeItem(this.USER);
    window.localStorage.setItem(this.USER, JSON.stringify(user));
  }

  public getUser(): string | null {
    const user = window.localStorage.getItem(this.USER);
    return user;
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    return token;
  }

  saveRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken(): string | null {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    return refreshToken;
  }

  clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
