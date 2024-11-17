import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { NgSelectModule } from '@ng-select/ng-select';

const BASIC_URL = 'http://localhost:8080/api/v1/';

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
    private snackBar: MatSnackBar
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
    this.loadVehicles();
    this.loadUsers()
  }

  createService(): void {
    const createdService = {
      ...this.service,
      deleted: this.isDeleted,
      vehicleId: this.service.vehicleId
    };

    this.http.post<any>(`${BASIC_URL}services`, createdService).subscribe({
      next: () => {
        this.snackBar.open('Service created successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/services']);
      },
      error: (error) => console.error('Error creating service:', error)
    });
  }


}
