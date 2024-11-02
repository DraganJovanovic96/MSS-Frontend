import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-create-vehicle',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SidebarComponent],
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
    yearOfManufacture: null,
    customerId: null,
  };

  customers: any[] = []; // Array to hold the list of customers

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { 
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.http.get<any[]>(`${BASIC_URL}customers`, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (error) => console.error('Error fetching customers:', error)
    });
  }

  createVehicle(): void {
    const createdVehicle = { ...this.vehicle, deleted: this.isDeleted, customerId: this.vehicle.customerId };
    this.http.post<any>(`${BASIC_URL}vehicles`, createdVehicle, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
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
}