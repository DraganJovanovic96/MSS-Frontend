import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  private USER = 'mss-user';

  public saveUser(user: Object): void {
    this.clearUser();
    window.localStorage.setItem(this.USER, JSON.stringify(user));
  }

  public getUser(): string | null {
    const user = window.localStorage.getItem(this.USER);
    return user;
  }

  getUserImage(): string | null {
    const user = this.getUser();
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.imageUrl;
    }
    return null;
  }

  isFirstTimeSetupCompleted(): boolean {
    const user = this.getUser();
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.firstTimeSetupCompleted || false;
    }
    return false;
  }

  getNumberOfChildren(): number {
    const user = this.getUser();
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.numberOfChildren || 0;
    }
    return 0;
  }

  getRole(): string {
    const user = this.getUser();
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.role || 'USER';
    }
    return 'USER';
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isReceptionist(): boolean {
    return this.getRole() === 'RECEPTIONIST';
  }

  isMechanic(): boolean {
    return this.getRole() === 'MECHANIC';
  }

  clearUser(): void {
    localStorage.removeItem(this.USER);
  }
}
