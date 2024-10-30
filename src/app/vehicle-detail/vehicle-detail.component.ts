import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule]
})
export class VehicleDetailComponent implements OnInit {
  // Initialize vehicle with customerDto to avoid undefined issues
  vehicle: any = {
    manufacturer: '',
    model: '',
    vehiclePlate: '',
    vin: '',
    yearOfManufacture: null,
    customerDto: {
      phoneNumber: '',
      firstname: '',
      lastname: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const vehicleId = this.route.snapshot.paramMap.get('id');
    if (vehicleId) {
      this.getVehicleById(+vehicleId);
    }
  }

  getVehicleById(id: number): void {
    this.http.get<any>(`${BASIC_URL}vehicles/id/${id}`, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => this.vehicle = { ...this.vehicle, ...data }, 
      error: (error) => console.error(`Error fetching vehicle with ID ${id}:`, error)
    });
  }
}
