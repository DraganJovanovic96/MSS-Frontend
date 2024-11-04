import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeleteConfirmationDialogComponent } from '../../services/DeleteConfirmationDialogComponent ';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, DeleteConfirmationDialogComponent, RouterModule, SidebarComponent],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent implements OnInit {
  isDeleted: boolean = true;

  customer: any = {
    id: null,
    createdAt: '',
    updatedAt: '',
    deleted: '',
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
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.getCustomerById(+customerId);
    }
  }

  updateCustomer(): void {
    const updatedCustomer = { ...this.customer, deleted: this.customer.isDeleted };
    this.http.put<any>(`${BASIC_URL}customers/id/${this.customer.id}`, updatedCustomer, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: () => {
        this.snackBar.open('Customer status updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/customers']);
      },
      error: (error) => console.error('Error updating customer:', error)
    });
  }

  deleteCustomer(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete<any>(`${BASIC_URL}customers/id/${id}`, {
          headers: this.authService.createAuthorizationHeader()
        }).subscribe({
          next: () => {
            this.snackBar.open('Customer deleted successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'bottom'
            });
            this.router.navigate(['/customers']);
          },
          error: (error) => {
            if (error.status === 404) {
              this.snackBar.open('Customer not found. Redirecting to customer list.', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom'
              });
              this.router.navigate(['/customers']);
            } else {
              console.error(`Error deleting customer with ID ${id}:`, error);
              this.snackBar.open('Error deleting customer. Please try again.', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom'
              });
            }
          }
        });
      }
    });
  }

  getCustomerById(id: number): void {
    this.http.get<any>(`${BASIC_URL}customers/id/${id}`, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => {
        this.customer = { ...this.customer, ...data };
        this.customer.isDeleted = data.deleted;
      },
      error: (error) => console.error(`Error fetching vehicle with ID ${id}:`, error)
    });
  }

}
