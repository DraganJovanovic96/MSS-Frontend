import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Injectable({
  providedIn: 'root',
})
export class RevenueService {
  constructor(private http: HttpClient) {}

  getCounts(startDate: string, endDate: string) {
    const body = { startDate, endDate };
    return this.http.post<{revenue:number, parts: number }>(
      `${BASIC_URL}revenue/counts`,
      body
    );
  }
}
