import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserStorageService } from '../../storage/user-storage.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const userStorage = inject(UserStorageService);
  const router = inject(Router);

  const isLoggedIn = userStorage.getToken() !== null;
  if (!isLoggedIn) {
    router.navigate(['/login']);
  }
  return isLoggedIn;
};
