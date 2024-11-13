import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, switchMap, catchError, throwError } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { TokenStateService } from './token.state.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const userStorage = inject(UserStorageService);
  const authService = inject(AuthService);
  const tokenStateService = inject(TokenStateService)
  const router = inject(Router);
  const authToken = userStorage.getToken();
  const refreshToken = userStorage.getRefreshToken();

  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }

  return next(authReq).pipe(
    catchError((error) => {


      if (error.status === 401) {

        tokenStateService.setRefreshAttempted(true);
        if (refreshToken) {

          return authService.refreshToken().pipe(
            switchMap((newAccessToken) => {
              if (newAccessToken) {
                userStorage.saveToken(newAccessToken);
                userStorage.saveRefreshToken(refreshToken);
                const retryReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`)
                });
                tokenStateService.reset();
                return next(retryReq);
              } else {
                tokenStateService.reset();
                authService.logout();
                return throwError(() => new Error('Unable to refresh token'));
              }
            }),
            catchError((refreshError) => {
              tokenStateService.reset();
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          tokenStateService.reset();
          authService.logout();
          router.navigate(['/login']);
        }
      }
      tokenStateService.reset();
      return throwError(() => error);
    })
  );
};
