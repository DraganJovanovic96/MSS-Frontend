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


  console.log(tokenStateService.getRefreshAttempted())
  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      
      
      if (error.status === 401) {
        console.log("401 Unauthorized error, attempting token refresh");
        
        tokenStateService.setRefreshAttempted(true);
        if (refreshToken) {
          console.log("Refresh token found, attempting to refresh token");

          return authService.refreshToken().pipe(
            switchMap((newAccessToken) => {
              if (newAccessToken) {
                console.log("New access token received:", newAccessToken);
                userStorage.saveToken(newAccessToken);
                userStorage.saveRefreshToken(refreshToken);
                const retryReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`)
                });
                tokenStateService.reset();
                return next(retryReq);
              } else {
                tokenStateService.reset();
                console.log("Unable to refresh token, logging out");
                // userStorage.clearTokens();
                authService.logout();
                return throwError(() => new Error('Unable to refresh token'));
              }
            }),
            catchError((refreshError) => {
              tokenStateService.reset();
              console.log("Error during refresh token:", refreshError);
              // userStorage.clearTokens();
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          tokenStateService.reset();
          console.log("No refresh token found, logging out");
          // userStorage.clearTokens();
          authService.logout();
          router.navigate(['/login']);
        }
      }
      tokenStateService.reset();
      return throwError(() => error);
    })
  );
};
