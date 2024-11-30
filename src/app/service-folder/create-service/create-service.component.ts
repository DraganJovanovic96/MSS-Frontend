import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SidebarComponent, NgSelectModule],
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss'
})
export class CreateServiceComponent implements OnInit {

  isDeleted: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  services: any[] = [];
  vehicles: any[] = [];
  users: any[] = [];

  service: any = {
    id: null,
    invoiceCode: '',
    startDate: null,
    endDate: null,
    currentMileage: null,
    nextServiceMileage: null,
    vehicleId: null,
    userId: null
  };

  loadVehicles(): void {
    this.http.get<any[]>(`${BASIC_URL}vehicles`).subscribe({
      next: (data) => {
        this.vehicles = data.map(vehicle => ({
          ...vehicle,
          fullName: `${vehicle.manufacturer} ${vehicle.model}`
        }));
      },
      error: (error) => console.error('Error fetching vehicles:', error)
    });
  }

  loadUsers(): void {
    this.http.get<any[]>(`${BASIC_URL}users`).subscribe({
      next: (data) => {
        this.users = data.map(user => ({
          ...user,
          fullName: `${user.firstname} ${user.lastname}`
        }));
      },
      error: (error) => console.error('Error fetching users:', error)
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const vehicleId = params.get('vehicleId');
      if (vehicleId) {
        this.service.vehicleId = +vehicleId; 
      }
    });

    this.loadVehicles();
    this.loadUsers();
    this.loadAuthenticatedUser();
  }

  loadAuthenticatedUser(): void {
    this.http.get<any>(`${BASIC_URL}users/user-details`).subscribe({
      next: (user) => {
        this.service.userId = user.id; 
      },
      error: (error) => console.error('Error fetching authenticated user:', error)
    });
  }

  createService(): void {
    const createdService = {
      ...this.service,
      deleted: this.isDeleted,
      vehicleId: this.service.vehicleId
    };

    this.http.post<any>(`${BASIC_URL}services`, createdService).subscribe({
      next: (response) => {
        this.snackBar.open('Service created successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/create-service-type'], { queryParams: { serviceId: response.id } });
      },
      error: (error) => console.error('Error creating service:', error)
    });
  }


}
