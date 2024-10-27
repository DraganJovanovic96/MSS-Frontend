import { Injectable } from '@angular/core';

const TOKEN = 'mss-token';
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

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN);
  }
}
