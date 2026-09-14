import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

export interface Vehicle {
  id: number;
  manufacturer: string;
  model: string;
  vehiclePlate: string;
  vin: string;
  yearOfManufacture: number;
  customerId: number;
  customerDto?: {
    id: number;
    firstname: string;
    lastname: string;
    phoneNumber: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${BASIC_URL}vehicles`);
  }

  getVehiclesByCustomerId(customerId: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${BASIC_URL}vehicles/customer/${customerId}`);
  }

  getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${BASIC_URL}vehicles/${id}`);
  }

  searchVehicles(searchDto: any, page: number = 0, pageSize: number = 10): Observable<any> {
    return this.http.post<any>(`${BASIC_URL}vehicles/search?page=${page}&pageSize=${pageSize}`, searchDto, {
      observe: 'response'
    });
  }
}
