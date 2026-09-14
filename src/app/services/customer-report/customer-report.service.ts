import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

export enum CustomerReportStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED'
}

export interface CustomerReportDto {
  id: number;
  customerId: number;
  vehicleId: number;
  customerName: string;
  customerEmail: string;
  vehicleInfo: string;
  createdBy: string;
  issueDescription: string;
  photoUrls: string;
  status: CustomerReportStatus;
  createdAt: string;
  reviewedAt: string;
  assignedAt: string;
  userId: number;
  assignedToName: string;
  assignedServiceRequestId: string;
  serviceId: number;
}

export interface CustomerReportCreateDto {
  customerId: number;
  vehicleId: number;
  issueDescription: string;
}

export interface CustomerReportUpdateDto {
  id?: number;
  customerId?: number;
  vehicleId?: number;
  customerName?: string;
  customerEmail?: string;
  vehicleInfo?: string;
  createdBy?: string;
  issueDescription?: string;
  photoUrls?: string;
  status?: CustomerReportStatus;
  createdAt?: string;
  reviewedAt?: string;
  assignedAt?: string;
  userId?: number;
  assignedToName?: string;
  serviceId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerReportService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  createCustomerReport(formData: FormData): Observable<CustomerReportDto> {
    return this.http.post<CustomerReportDto>(`${BASIC_URL}customer-reports`, formData);
  }

  getMyReports(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<CustomerReportDto[]>(`${BASIC_URL}customer-reports/my-reports?page=${page}&size=${size}`, {
      observe: 'response'
    });
  }

  getAllReports(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<CustomerReportDto[]>(`${BASIC_URL}customer-reports/all?page=${page}&size=${size}`, {
      observe: 'response'
    });
  }

  getPendingReports(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<CustomerReportDto[]>(`${BASIC_URL}customer-reports/pending?page=${page}&size=${size}`, {
      observe: 'response'
    });
  }

  getReportById(id: number): Observable<CustomerReportDto> {
    return this.http.get<CustomerReportDto>(`${BASIC_URL}customer-reports/${id}`);
  }

  updateReport(id: number, data: CustomerReportUpdateDto): Observable<CustomerReportDto> {
    return this.http.put<CustomerReportDto>(`${BASIC_URL}customer-reports/${id}`, data, this.httpOptions);
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${BASIC_URL}customer-reports/${id}`);
  }
}
