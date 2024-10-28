import { Injectable } from '@angular/core';

const TOKEN = 'mss-token';
const REFRESH_TOKEN = 'mss-refresh-token';
const USER = 'mss-user';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor() { }

  logout() {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(REFRESH_TOKEN);
    window.localStorage.removeItem(USER);
  }
  return
  }
}