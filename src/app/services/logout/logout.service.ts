import { Injectable } from '@angular/core';

const TOKEN = 'mss-token';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor() { }

  logout() {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
    window.localStorage.removeItem(TOKEN);
  }
  return
  }
}