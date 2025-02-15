import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-create-vehicle',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SidebarComponent, NgSelectModule],
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.scss']
})
export class CreateVehicleComponent {
  isDeleted: boolean = false;

  vehicle: any = {
    id: null,
    manufacturer: '',
    model: '',
    vehiclePlate: '',
    vin: '',
    yearOfManufacture: 2010,
    customerId: null,
  };

  customers: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.prefillServiceId();
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.http.get<any[]>(`${BASIC_URL}customers`).subscribe({
      next: (data) => {
        this.customers = data.map(customer => ({
          ...customer,
          fullName: `${customer.firstname} ${customer.lastname}`
        }));
      },
      error: (error) => console.error('Error fetching customers:', error)
    });
  }

  prefillServiceId(): void {
    const customerId = this.route.snapshot.queryParamMap.get('customerId');
    if (customerId) {
      this.vehicle.customerId = +customerId;
    }
  }


  createVehicle(): void {
    const vinWithoutSpecialChars = this.vehicle.vin.replace(/[^a-zA-Z0-9]/g, '');
    const plateWithoutSpecialChars = this.vehicle.vehiclePlate.replace(/[^a-zA-Z0-9-]/g, '');

    const createdVehicle = {
      ...this.vehicle,
      deleted: this.isDeleted,
      vin: vinWithoutSpecialChars,
      vehiclePlate: plateWithoutSpecialChars,
      customerId: this.vehicle.customerId
    };

    this.http.post<any>(`${BASIC_URL}vehicles`, createdVehicle).subscribe({
      next: () => {
        this.snackBar.open('Vehicle created successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/vehicles']);
      },
      error: (error) => console.error('Error creating vehicle:', error)
    });
  }

  formatVin(event: Event): void {
    const input = event.target as HTMLInputElement;
    let vin = input.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();;
    vin = vin.match(/.{1,4}/g)?.join('-') || vin;
    input.value = vin;
    this.vehicle.vin = vin;
  }

  formatPlate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let plate = input.value.toUpperCase();
    input.value = plate;
    this.vehicle.vehiclePlate = plate;
  }
}
