import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-service-type-create',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SidebarComponent, NgSelectModule],
  templateUrl: './service-type-create.component.html',
  styleUrl: './service-type-create.component.scss'
})
export class ServiceTypeCreateComponent implements OnInit {
  services: any[] = [];
  serviceType: any = {
    typeOfService: '',
    description: '',
    partCode: '',
    quantity: 1,
    price: 0,
    serviceId: null
  };

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.prefillServiceId();
    this.loadServices();
  }

  prefillServiceId(): void {
    const serviceId = this.route.snapshot.queryParamMap.get('serviceId');
    if (serviceId) {
      this.serviceType.serviceId = +serviceId;
    }
  }

  loadServices(): void {
    this.http.get<any[]>(`${BASIC_URL}services`).subscribe({
      next: (data) => {
        this.services = data.map((service) => ({
          id: service.id,
          invoiceCode: service.invoiceCode
        }));
      },
      error: (error) => {
        console.error('Error fetching services:', error);
        this.snackBar.open('Failed to load services. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  createServiceType(): void {
    if (!this.serviceType.quantity || this.serviceType.quantity < 1) {
      this.serviceType.quantity = 1;
    }

    const createdServiceType = {
      ...this.serviceType
    };

    this.http.post<any>(`${BASIC_URL}service-types`, createdServiceType).subscribe({
      next: () => {
        this.snackBar.open('Service type created successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating service type:', error);
        this.snackBar.open('Failed to create service type. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  resetForm(): void {
    this.serviceType = {
      typeOfService: '',
      description: '',
      quantity: 1,
      price: 0,
      serviceId: this.serviceType.serviceId 
    };
  }
}
