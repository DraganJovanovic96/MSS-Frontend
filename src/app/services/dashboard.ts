import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getCounts() {
    return this.http.get<{ customers: number; vehicles: number; services: number }>(`${BASIC_URL}dashboard/counts`);
  }
}
