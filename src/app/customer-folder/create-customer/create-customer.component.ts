import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,SidebarComponent],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.scss'
})
export class CreateCustomerComponent {
  isDeleted: boolean = false;

  customer: any = {
    id: null,
    createdAt: '',
    updatedAt:'',
    deleted:'',
    firstname: '',
    lastname: '',
    address: '',
    phoneNumber: '',
    vehicleDtos: {
      manufacturer: '',
      model: '',
      vehiclePlate: '',
      vin: '',
      yearOfManufacture: null,
    }
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  createCustomer(): void {
    const cratedVehicle = { ...this.customer, deleted: this.isDeleted};
    this.http.post<any>(`${BASIC_URL}customers`, cratedVehicle, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: () => {
        this.snackBar.open('Customer created successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/customers']);
      },
      error: (error) => console.error('Error creating customer:', error)
    });
  }
}
