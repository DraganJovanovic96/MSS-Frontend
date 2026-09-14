import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BASIC_URL}users`);
  }

  getMechanics(): Observable<User[]> {
    return this.http.get<User[]>(`${BASIC_URL}users?role=MECHANIC`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${BASIC_URL}users/${id}`);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${BASIC_URL}users/user`);
  }
}
