import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class RevenueService {
  constructor(private http: HttpClient) {}

  getCounts(startDate: string, endDate: string) {
    const body = { startDate, endDate };
     return this.http.post<{revenue:number, parts: number, services: number }>(
      `${BASIC_URL}revenue/counts`,
      body
    );
  }
}
