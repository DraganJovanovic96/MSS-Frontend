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
    this.clearUser();
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

  getUserImage(): string | null {
    const user = this.getUser();
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.imageUrl;
    }
    return null;
  }

  clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  clearUser(): void {
    localStorage.removeItem(this.USER);
  }
}
