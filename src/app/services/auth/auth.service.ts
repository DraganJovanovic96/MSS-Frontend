import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';
import { Router } from '@angular/router';

const BASIC_URL = "http://localhost:8080/api/v1/";

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
     private UserStorageService: UserStorageService,
     private router: Router) { }

  login(email: string, password: string): any {
    const headers = new HttpHeaders().set('Content-Type','application/json')
                                     .set('Accept', '*/*')
    const body={email, password};

    return this.http.post<AuthResponse>(BASIC_URL+'auth/authenticate',body, { headers, observe: 'response'}).pipe(
      map((res) => {
        const token = res.body?.access_token;
        const refresh_token = res.body?.refresh_token;
        if(token) {
          this.UserStorageService.saveToken(token);
        }
        if(refresh_token) {
          this.UserStorageService.saveRefreshToken(refresh_token);
          this.router.navigate(['/']); 
          return true;
        }
        return false;
      })
    )
  }

  
}
