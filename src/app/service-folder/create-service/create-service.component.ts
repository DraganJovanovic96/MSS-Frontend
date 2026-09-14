import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { environment } from '../../../environments/environment';
import { SharedDataService } from '../../services/SharedDataService';
import { CustomerReportService, CustomerReportStatus } from '../../services/customer-report/customer-report.service';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, NgSelectModule, MatSlideToggleModule],
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss'
})
export class CreateServiceComponent implements OnInit {

  isDeleted: boolean = false;
  isServiceCompleted: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private customerReportService: CustomerReportService
  ) { }

  services: any[] = [];
  vehicles: any[] = [];
  users: any[] = [];
  customerReportId: number | null = null;
  issueDescription: string = '';
  shouldUpdateReportStatus: boolean = false;

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

    const customerReportData = this.sharedDataService.getCustomerReportData();
    if (customerReportData) {
      if (customerReportData.startDate) {
        this.service.startDate = customerReportData.startDate;
      }
      if (customerReportData.vehicleId) {
        this.service.vehicleId = customerReportData.vehicleId;
      }
      this.customerReportId = customerReportData.customerReportId;
      this.issueDescription = customerReportData.issueDescription;
      this.shouldUpdateReportStatus = true;

      this.sharedDataService.clearCustomerReportData();
    }

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
    if (this.isServiceCompleted && !this.service.endDate) {
      this.service.endDate = new Date().toISOString().split('T')[0];
    }

    if (!this.isServiceCompleted) {
      this.service.endDate = null;
    }

    const createdService = {
      ...this.service,
      deleted: this.isDeleted,
      vehicleId: this.service.vehicleId
    };

    if (this.customerReportId) {
      createdService.customerReportId = this.customerReportId;
    }

    this.http.post<any>(`${BASIC_URL}services`, createdService).subscribe({
      next: (response) => {
        if (this.shouldUpdateReportStatus && this.customerReportId) {
          this.customerReportService.updateReport(this.customerReportId, {
            status: CustomerReportStatus.ASSIGNED,
            userId: this.service.userId,
            serviceId: response.id
          }).subscribe({
            next: () => {
            },
            error: (error) => {
              console.error('Error updating customer report status:', error);
            }
          });
        }

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
