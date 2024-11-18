import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedDataService } from '../../services/SharedDataService';

const BASIC_URL = 'http://localhost:8080/api/v1/';

interface ServiceTypeUpdateDto {
  id: number;
  typeOfService: string;
  description: string;
  price: number;
  serviceId: number;
}

interface ServiceTypeDto {
  id: number;
  typeOfService: string;
  description: string;
  price: number;
  serviceId: number;
}


@Component({
  selector: 'app-service-type-details',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,
    SidebarComponent, NgSelectModule],
  templateUrl: './service-type-details.component.html',
  styleUrl: './service-type-details.component.scss'
})
export class ServiceTypeDetailsComponent implements OnInit {
  isDeleted: boolean = true;

  serviceType: any = {
    typeOfService: '',
    description: '',
    price: 0,
    serviceId: ''
  };

  serviceId!: number;
  services: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loadServices();
  }

  ngOnInit(): void {
    const vehicleId = this.route.snapshot.paramMap.get('id');
    if (vehicleId) {
      this.getServiceTypeById(+vehicleId);
    }
  }

  loadServices(): void {
    this.http.get<any[]>(`${BASIC_URL}services`).subscribe({
      next: (data) => {
        this.services = data.map(service => ({
          ...service,
        }));
      },
      error: (error) => console.error('Error fetching services:', error)
    });
  }

  updateServiceType(): void {
    const updateServiceType: ServiceTypeUpdateDto = {
      id: this.serviceType.id,
      typeOfService: this.serviceType.typeOfService,
      description: this.serviceType.description,
      price: this.serviceType.price,
      serviceId: this.serviceType.serviceId
    };

    this.http.put<ServiceTypeDto>(`${BASIC_URL}service-types/id/${this.serviceType.id}`, updateServiceType).subscribe({
      next: () => {
        this.snackBar.open('Service type updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/service-types']);
      },
      error: (error) => {
        console.error('Error updating service type:', error);
        this.snackBar.open('Error updating service type. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
      }
    });
  }

  getServiceTypeById(id: number): void {
    this.http.get<any>(`${BASIC_URL}service-types/id/${id}`).subscribe({
      next: (data) => {
        this.serviceType = { ...this.serviceType, ...data };
        this.serviceType.isDeleted = data.deleted;
        this.serviceType.serviceId = data.serviceDto?.id;
        // this.sharedDataService.setCustomerId(this.vehicle.customerId);
      },
      error: (error) => console.error(`Error fetching service type with ID ${id}:`, error)
    });
  }
}
