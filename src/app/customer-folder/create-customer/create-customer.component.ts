import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SidebarComponent],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.scss'
})
export class CreateCustomerComponent {
  isDeleted: boolean = false;
  blurredEmail = false;
  emailPattern: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  customer: any = {
    id: null,
    createdAt: '',
    updatedAt: '',
    deleted: '',
    firstname: '',
    lastname: '',
    address: '',
    email: '',
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
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  createCustomer(): void {
    const cratedVehicle = { ...this.customer, deleted: this.isDeleted };
    this.http.post<any>(`${BASIC_URL}customers`, cratedVehicle).subscribe({
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

  onEmailBlur() {
    this.blurredEmail = true;
  }

  onEmailFocus(): void {
    this.blurredEmail = false;
  }

  validatePhoneNumber(event: KeyboardEvent): void {
    const allowedCharacters = /^[0-9+\-()s]*$/;
    const inputCharacter = event.key;
    if (!allowedCharacters.test(inputCharacter)) {
      event.preventDefault();
    }
  }

  sanitizePhoneNumber(): void {
    this.customer.phoneNumber = this.customer.phoneNumber.replace(/[^0-9+\-()\s]/g, '');
  }
}
