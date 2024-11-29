import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:8080/api/v1/dashboard/counts';

  constructor(private http: HttpClient) {}

  getCounts() {
    return this.http.get<{ customers: number; vehicles: number; services: number }>(this.API_URL);
  }
}
