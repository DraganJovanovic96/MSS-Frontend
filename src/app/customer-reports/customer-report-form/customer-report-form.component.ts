import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerReportService, CustomerReportCreateDto } from '../../services/customer-report/customer-report.service';
import { CustomerService, Customer } from '../../services/customer/customer.service';
import { VehicleService, Vehicle } from '../../services/vehicle/vehicle.service';
import { PhotoUploadComponent } from '../photo-upload/photo-upload.component';
import { UserStorageService } from '../../services/storage/user-storage.service';

@Component({
  selector: 'app-customer-report-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PhotoUploadComponent
  ],
  templateUrl: './customer-report-form.component.html',
  styleUrls: ['./customer-report-form.component.scss']
})
export class CustomerReportFormComponent implements OnInit {
  @ViewChild('photoUploadComponent') photoUploadComponent!: PhotoUploadComponent;

  reportForm: FormGroup;
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  selectedPhotos: File[] = [];
  selectedCustomerId: number | null = null;
  selectedVehicleId: number | null = null;
  isSubmitting = false;
  isLoadingCustomers = false;
  isLoadingVehicles = false;
  isDragOver = false;

  constructor(
    private fb: FormBuilder,
    private customerReportService: CustomerReportService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private userStorageService: UserStorageService
  ) {
    this.reportForm = this.fb.group({
      issueDescription: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  canCreateReport(): boolean {
    return this.userStorageService.isReceptionist() || this.userStorageService.isAdmin();
  }

  loadCustomers(): void {
    this.isLoadingCustomers = true;
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data.map(customer => ({
          ...customer,
          fullName: `${customer.firstname} ${customer.lastname}`
        }));
        this.isLoadingCustomers = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.snackBar.open('Error loading customers', 'Close', { duration: 3000 });
        this.isLoadingCustomers = false;
      }
    });
  }

  onCustomerChange(customerId: any): void {
    const id = typeof customerId === 'object' ? customerId.id : customerId;
    this.selectedCustomerId = id;
    this.selectedVehicleId = null;
    this.reportForm.patchValue({ customerId: id || '' });

    if (id) {
      this.isLoadingVehicles = true;
      this.vehicleService.getAllVehicles().subscribe({
        next: (data) => {
          this.vehicles = data;
          this.filteredVehicles = data
            .filter(vehicle => {
              const vehicleCustomerId = vehicle.customerDto?.id;
              return vehicleCustomerId === id;
            })
            .map(vehicle => ({
              ...vehicle,
              vehicleInfo: `${vehicle.manufacturer} ${vehicle.model} (${vehicle.vehiclePlate})`
            }));
          this.reportForm.patchValue({ vehicleId: '' });
          this.isLoadingVehicles = false;
        },
        error: (error) => {
          console.error('Error loading vehicles:', error);
          this.snackBar.open('Error loading vehicles', 'Close', { duration: 3000 });
          this.isLoadingVehicles = false;
        }
      });
    } else {
      this.filteredVehicles = [];
      this.reportForm.patchValue({ vehicleId: '' });
    }
  }

  onVehicleChange(vehicleId: any): void {
    const id = typeof vehicleId === 'object' ? vehicleId.id : vehicleId;
    this.selectedVehicleId = id;
    this.reportForm.patchValue({ vehicleId: id || '' });
  }

  compareCustomers(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareVehicles(v1: any, v2: any): boolean {
    return v1 && v2 ? v1.id === v2.id : v1 === v2;
  }

  onPhotosSelected(files: File[]): void {
    this.selectedPhotos = files;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = Array.from(event.dataTransfer?.files || []);
    this.processDroppedFiles(files);
  }

  processDroppedFiles(files: File[]): void {
    if (this.photoUploadComponent) {
      this.photoUploadComponent.processFiles(files);
    }
  }

  onSubmit(): void {
    if (!this.selectedCustomerId || !this.selectedVehicleId) {
      this.snackBar.open('Please select customer and vehicle', 'Close', { duration: 3000 });
      return;
    }

    if (this.reportForm.get('issueDescription')?.invalid) {
      this.reportForm.get('issueDescription')?.markAsTouched();
      this.snackBar.open('Please fill in issue description', 'Close', { duration: 3000 });
      return;
    }

    if (!this.canCreateReport()) {
      this.snackBar.open('You do not have permission to create reports', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    const formValue = this.reportForm.value;

    formData.append('customerId', this.selectedCustomerId.toString());
    formData.append('vehicleId', this.selectedVehicleId.toString());
    formData.append('issueDescription', formValue.issueDescription);

    this.selectedPhotos.forEach((file) => {
      formData.append('photos', file);
    });

    this.customerReportService.createCustomerReport(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.snackBar.open('Customer report created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/customer-reports', response.id]);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating report:', error);
        this.snackBar.open('Error creating customer report', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/customer-reports']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getCustomerName(customer: Customer): string {
    return `${customer.firstname} ${customer.lastname}`;
  }

  getVehicleInfo(vehicle: Vehicle): string {
    return `${vehicle.manufacturer} ${vehicle.model} (${vehicle.vehiclePlate})`;
  }
}
