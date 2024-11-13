import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { UserStorageService } from '../storage/user-storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenStateService } from './token.state.service';
export const errorInterceptor = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const userStorageService = inject(UserStorageService);
  const router = inject(Router);
  const tokenStateService = inject(TokenStateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && tokenStateService.getRefreshAttempted()) {
        tokenStateService.reset();
        userStorageService.clearTokens();
        authService.logout();

      } else if (error.status === 403) {
        tokenStateService.reset();
        userStorageService.clearTokens();
        authService.logout();
        router.navigate(['/login']);
      } else {
        tokenStateService.reset();
        console.error(`HTTP error: ${error.status} - ${error.message}`);
      }

      tokenStateService.reset();
      return throwError(() => error);
    })
  );
};
