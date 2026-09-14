import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorageService } from '../../storage/user-storage.service';

export const firstTimeSetupGuard: CanActivateFn = (route, state) => {
  const userStorage = inject(UserStorageService);
  const router = inject(Router);

  const user = userStorage.getUser();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const firstTimeSetupCompleted = userStorage.isFirstTimeSetupCompleted();

  if (firstTimeSetupCompleted) {
    router.navigate(['/']);
    return false;
  }

  return true;
};