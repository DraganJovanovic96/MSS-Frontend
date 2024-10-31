import { Injectable } from '@angular/core';

const TOKEN = 'mss-token';
const REFRESH_TOKEN = 'mss-refresh-token';
const USER = 'mss-user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  public saveUser(user: Object): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  public getUser(): string | null {
    return window.localStorage.getItem(USER);
  }

  public saveRefreshToken(refresh_token: string): void {
    window.localStorage.removeItem(REFRESH_TOKEN);
    window.localStorage.setItem(REFRESH_TOKEN, refresh_token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN);
  }
}
