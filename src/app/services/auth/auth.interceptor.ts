import { HttpHandler, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserStorageService } from '../storage/user-storage.service';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const userStorage = inject(UserStorageService);
  const authToken = userStorage.getToken();

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`)
  });

  return next(authReq);
};


