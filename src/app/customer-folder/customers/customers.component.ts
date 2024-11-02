import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
    selector: 'app-customers',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
customers: any[] = [];

customer: any = {
  id: null,
  createdAt: '',
  updatedAt:'',
  deleted:'',
  firstname: '',
  lastname: '',
  address: '',
  phoneNumber: '',
  vehicleDtos: {
    manufacturer: '',
    model: '',
    vehiclePlate: '',
    vin: '',
    yearOfManufacture: null,
  }
}

constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
) { }   

ngOnInit(): void {
    this.getAllCustomers();
  }

  getCustomerById(id: number): void {
    this.router.navigate([`/customers`, id]);
  }

  getAllCustomers(): void {
    this.http.get<any[]>(BASIC_URL + 'customers', {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => this.customers = data,
      error: (error) => console.error('Error fetching customers:', error)
    });
  }
}
