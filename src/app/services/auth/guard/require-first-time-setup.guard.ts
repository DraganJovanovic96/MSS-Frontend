import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorageService } from '../../storage/user-storage.service';

export const requireFirstTimeSetupGuard: CanActivateFn = (route, state) => {
  const userStorage = inject(UserStorageService);
  const router = inject(Router);

  const user = userStorage.getUser();
  if (!user) {
    return true;
  }

  const firstTimeSetupCompleted = userStorage.isFirstTimeSetupCompleted();

  if (!firstTimeSetupCompleted) {
    const currentUrl = state.url;
    if (currentUrl === '/first-time-setup' || currentUrl === '/login' || currentUrl === '/auth-callback') {
      return true;
    }
    
    router.navigate(['/first-time-setup']);
    return false;
  }

  return true;
};