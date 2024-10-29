import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserStorageService } from '../services/storage/user-storage.service';
import { AuthService } from '../services/auth/auth.service';

const BASIC_URL = "http://localhost:8080/api/v1/";

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent {
  constructor(private http: HttpClient, private userStorageService: UserStorageService, private authService: AuthService) { }

  getAllVehicles(): void {
    this.http.get(BASIC_URL + 'vehicles', {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => console.log('Vehicles data:', data),
      error: (error) => console.error('Error fetching vehicles:', error)
    });
  }
}