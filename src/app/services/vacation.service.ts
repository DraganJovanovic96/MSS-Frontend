import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const BASIC_URL = environment.apiUrl;

export interface VacationRequest {
  id?: number;
  employee?: any;
  startDate: string;
  endDate: string;
  daysUsed: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
  vacationYear: number;
  processedBy?: any;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

export interface VacationBalance {
  totalAllowedDays: number;
  usedDays: number;
  remainingDays: number;
  deadline: string;
}

@Injectable({
  providedIn: 'root'
})
export class VacationService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  createVacationRequest(request: { startDate: string; endDate: string }): Observable<VacationRequest> {
    return this.http.post<VacationRequest>(`${BASIC_URL}vacation-requests`, request, this.httpOptions);
  }

  getMyVacationRequests(): Observable<VacationRequest[]> {
    return this.http.get<VacationRequest[]>(`${BASIC_URL}vacation-requests/my-requests`);
  }

  getAllVacationRequests(): Observable<VacationRequest[]> {
    return this.http.get<VacationRequest[]>(`${BASIC_URL}vacation-requests`);
  }

  getPendingVacationRequests(): Observable<VacationRequest[]> {
    return this.http.get<VacationRequest[]>(`${BASIC_URL}vacation-requests/pending`);
  }

  getVacationRequestById(requestId: number): Observable<VacationRequest> {
    return this.http.get<VacationRequest>(`${BASIC_URL}vacation-requests/${requestId}`);
  }

  updateVacationRequest(requestId: number, data: { status: string; rejectionReason?: string }): Observable<VacationRequest> {
    return this.http.put<VacationRequest>(`${BASIC_URL}vacation-requests/${requestId}`, data, this.httpOptions);
  }

  deleteVacationRequest(requestId: number): Observable<void> {
    return this.http.delete<void>(`${BASIC_URL}vacation-requests/${requestId}`);
  }

  getRemainingVacationDays(year: number): Observable<number> {
    return this.http.get<number>(`${BASIC_URL}vacation-requests/remaining-days?year=${year}`);
  }

  getActiveTimeOff(): Observable<number> {
    return this.http.get<number>(`${BASIC_URL}vacation-requests/active-count`);
  }

  getTotalApproved(): Observable<number> {
    return this.http.get<number>(`${BASIC_URL}vacation-requests/total-approved`);
  }

  getTotalAvailableDays(): Observable<number> {
    return this.http.get<number>(`${BASIC_URL}vacation-requests/total-available`);
  }

  calculateBusinessDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let businessDays = 0;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return businessDays;
  }

  getTimeOffYear(startDate: string): number {
    const date = new Date(startDate);
    return date.getMonth() >= 6 ? date.getFullYear() + 1 : date.getFullYear();
  }
}
