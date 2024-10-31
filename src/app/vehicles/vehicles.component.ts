import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  vehicles: any[] = [];
  vehicle: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllVehicles();
  }

  getAllVehicles(): void {
    this.http.get<any[]>(BASIC_URL + 'vehicles', {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => this.vehicles = data,
      error: (error) => console.error('Error fetching vehicles:', error)
    });
  }

  getVehicleById(id: number, isDeleted: boolean): void {
    this.router.navigate([`/vehicles`, id]);
  }
}
