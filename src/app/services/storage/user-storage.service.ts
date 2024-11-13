import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  private tokenKey = 'auth-token';
  private refreshTokenKey = 'refresh-token';
  private USER = 'mss-user';

  saveToken(token: string): void {
    console.log("Saving access token:", token);
    localStorage.setItem(this.tokenKey, token);
    console.log("Access token saved successfully.");
  }

  public saveUser(user: Object): void {
    console.log("Saving user data:", user);
    window.localStorage.removeItem(this.USER);
    window.localStorage.setItem(this.USER, JSON.stringify(user));
    console.log("User data saved successfully.");
  }

  public getUser(): string | null {
    const user = window.localStorage.getItem(this.USER);
    // console.log("Retrieved user data:", user);
    return user;
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    // console.log("Retrieved access token:", token);
    return token;
  }

  saveRefreshToken(token: string): void {
    console.log("Saving refresh token:", token);
    localStorage.setItem(this.refreshTokenKey, token);
    console.log("Refresh token saved successfully.");
  }

  getRefreshToken(): string | null {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    // console.log("Retrieved refresh token:", refreshToken);
    return refreshToken;
  }

  clearTokens(): void {
    console.log("Clearing tokens");
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    console.log("Tokens cleared successfully.");
  }
}
