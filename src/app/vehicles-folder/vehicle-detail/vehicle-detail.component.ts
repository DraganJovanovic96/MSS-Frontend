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
import { DeleteConfirmationDialogComponent } from '../../services/DeleteConfirmationDialogComponent ';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule, DeleteConfirmationDialogComponent, SidebarComponent]
})
export class VehicleDetailComponent implements OnInit {
  isDeleted: boolean = true;
  vehicle: any = {
    id: null,
    manufacturer: '',
    model: '',
    vehiclePlate: '',
    vin: '',
    yearOfManufacture: null,
    customerDto: {
      phoneNumber: '',
      firstname: '',
      lastname: ''
    }
  };

  customerId!: number; // Property to hold customer ID

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const vehicleId = this.route.snapshot.paramMap.get('id');
    if (vehicleId) {
      this.getVehicleById(+vehicleId);
    }
  }

  getVehicleById(id: number): void {
    this.http.get<any>(`${BASIC_URL}vehicles/id/${id}`, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => {
        this.vehicle = { ...this.vehicle, ...data };
        this.vehicle.isDeleted = data.deleted;
        this.customerId = data.customerDto.id; // Extract customer ID here
      },
      error: (error) => console.error(`Error fetching vehicle with ID ${id}:`, error)
    });
  }

  deleteVehicle(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete<any>(`${BASIC_URL}vehicles/id/${id}`, {
          headers: this.authService.createAuthorizationHeader()
        }).subscribe({
          next: () => {
            this.snackBar.open('Vehicle deleted successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'bottom'
            });
            this.router.navigate(['/vehicles']);
          },
          error: (error) => {
            if (error.status === 404) {
              this.snackBar.open('Vehicle not found. Redirecting to vehicles list.', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom'
              });
              this.router.navigate(['/vehicles']);
            } else {
              console.error(`Error deleting vehicle with ID ${id}:`, error);
              this.snackBar.open('Error deleting vehicle. Please try again.', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom'
              });
            }
          }
        });
      }
    });
  }

  updateVehicle(): void {
    const updatedVehicle = { ...this.vehicle, deleted: this.vehicle.isDeleted };
    this.http.put<any>(`${BASIC_URL}vehicles/id/${this.vehicle.id}`, updatedVehicle, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: () => {
        this.snackBar.open('Vehicle status updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/vehicles']);
      },
      error: (error) => console.error('Error updating vehicle:', error)
    });
  }
}
