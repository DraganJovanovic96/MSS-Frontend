import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

export interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  address: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${BASIC_URL}customers`);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${BASIC_URL}customers/${id}`);
  }

  searchCustomers(searchDto: any, page: number = 0, pageSize: number = 10): Observable<any> {
    return this.http.post<any>(`${BASIC_URL}customers/search?page=${page}&pageSize=${pageSize}`, searchDto, {
      observe: 'response'
    });
  }
}
