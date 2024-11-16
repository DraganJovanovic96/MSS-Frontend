import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { DeleteConfirmationDialogComponent } from '../../services/DeleteConfirmationDialogComponent ';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { SharedDataService } from '../../services/SharedDataService';
import { NgSelectModule } from '@ng-select/ng-select';

const BASIC_URL = 'http://localhost:8080/api/v1/';

interface ServiceUpdateDto {
  id: number;
  startDate: string;
  endDate: string;
  currentMileage: number;
  nextServiceMileage: number;
  vehicleId: number;
  userId: number;
}

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,
    SidebarComponent, NgSelectModule],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  isDeleted: boolean = true;

  service: any = {
    id: null,
    invoiceCode: '',
    startDate: '',
    endDate: '',
    currentMileage: null,
    nextServiceMileage: null,
    vehicleId: null,
    userId: null,
    selectedVehicle: null,
    selectedUser: null
  };

  serviceId!: number;
  services: any[] = [];
  vehicles: any[] = [];
  users: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private sharedDataService: SharedDataService
  ) {
    this.loadVehicles();
  }

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.serviceId = +serviceId;
    }
  }

  loadVehicles(): void {
    this.http.get<any[]>(`${BASIC_URL}vehicles`).subscribe({
      next: (data) => {
        this.vehicles = data.map(vehicle => ({
          ...vehicle,
          fullName: `${vehicle.manufacturer} ${vehicle.model}`
        }));

        this.loadUsers();
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

        if (this.serviceId) {
          this.getServiceById(this.serviceId);
        }
      },
      error: (error) => console.error('Error fetching users:', error)
    });
  }

  getServiceById(id: number): void {
    this.http.get<any>(`${BASIC_URL}services/id/${id}`).subscribe({
      next: (data) => {
        this.service = { ...this.service, ...data };
        this.service.isDeleted = data.deleted;
        this.service.vehicleId = data.vehicleDto?.id || null;
        this.service.userId = data.userDto?.id || null;
      },
      error: (error) => console.error(`Error fetching service with ID ${id}:`, error)
    });
  }

  printService(id: number): void {
    this.http.get(`${BASIC_URL}download-invoice/id/${id}`, {
      responseType: 'blob'
    }).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (error) => console.error(`Error creating pdf of service with ID ${id}:`, error)
    });
  }

  deleteService(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete<any>(`${BASIC_URL}services/id/${id}`).subscribe({
          next: () => {
            this.snackBar.open('Service deleted successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'bottom'
            });
            this.router.navigate(['/services']);
          },
          error: (error) => {
            if (error.status === 404) {
              this.snackBar.open('Service not found. Redirecting to services list.', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom'
              });
              this.router.navigate(['/services']);
            } else {
              console.error(`Error deleting service with ID ${id}:`, error);
              this.snackBar.open('Error deleting service. Please try again.', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom'
              });
            }
          }
        });
      }
    });
  }

  updateService(): void {

    const updateService: ServiceUpdateDto = {
      id: this.service.id,
      startDate: this.service.startDate,
      endDate: this.service.endDate,
      vehicleId: this.service.vehicleId,
      userId: this.service.userId,
      currentMileage: this.service.currentMileage,
      nextServiceMileage: this.service.nextServiceMileage
    };

    this.http.put<ServiceUpdateDto>(`${BASIC_URL}services/id/${this.service.id}`, updateService).subscribe({
      next: () => {
        this.snackBar.open('Service updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/services']);
      },
      error: (error) => {
        console.error('Error updating service:', error);
        this.snackBar.open('Error updating serviec. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
      }
    });
  }
}
