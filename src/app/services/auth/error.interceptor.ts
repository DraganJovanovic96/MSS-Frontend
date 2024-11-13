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
    
          // If the refresh was already attempted, log the user out
          // console.log("Second 401 Unauthorized error in ErrorInterceptor, logging out user.");
          tokenStateService.reset();
          userStorageService.clearTokens();
          authService.logout();
          // router.navigate(['/login']); 
          //  && error.message.startsWith("Invalid token: JWT signature does not match")
          
        
      } else if (error.status === 403) {
        // Handle 403 Forbidden error
        tokenStateService.reset();
        userStorageService.clearTokens();
        authService.logout();
        router.navigate(['/login']); // Redirect to unauthorized page
      } else {
        // Log other errors
        tokenStateService.reset();
        console.error(`HTTP error: ${error.status} - ${error.message}`);
      }

      // Rethrow error after logging it or performing actions
      tokenStateService.reset();
      return throwError(() => error);
    })
  );
};
