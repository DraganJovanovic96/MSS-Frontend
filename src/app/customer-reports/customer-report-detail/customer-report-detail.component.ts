import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerReportService, CustomerReportDto, CustomerReportUpdateDto, CustomerReportStatus } from '../../services/customer-report/customer-report.service';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { PhotoGalleryComponent } from '../photo-gallery/photo-gallery.component';
import { DeleteConfirmationDialogComponent } from '../../services/DeleteConfirmationDialogComponent ';
import { UserService, User } from '../../services/user/user.service';
import { CustomerService, Customer } from '../../services/customer/customer.service';
import { VehicleService, Vehicle } from '../../services/vehicle/vehicle.service';
import { SharedDataService } from '../../services/SharedDataService';
import { EmailConfirmationDialogComponent } from '../email-confirmation-dialog/email-confirmation-dialog.component';
import { environment } from '../../../environments/environment';

interface ExtendedUser extends User {
  fullName: string;
}

@Component({
  selector: 'app-customer-report-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    NgSelectModule,
    PhotoGalleryComponent
  ],
  templateUrl: './customer-report-detail.component.html',
  styleUrls: ['./customer-report-detail.component.scss']
})
export class CustomerReportDetailComponent implements OnInit {
  CustomerReportStatus = CustomerReportStatus; // Make enum available in template
  report: CustomerReportDto | null = null;
  isLoading = false;
  isUpdating = false;
  mechanics: ExtendedUser[] = [];
  selectedTab = 0;
  customers: any[] = [];
  vehicles: any[] = [];
  statusOptions = [
    { label: 'Pending', value: CustomerReportStatus.PENDING },
    { label: 'Assigned', value: CustomerReportStatus.ASSIGNED },
    { label: 'Completed', value: CustomerReportStatus.COMPLETED }
  ];
  reportForm: any = {
    customerId: null,
    vehicleId: null,
    status: null as CustomerReportStatus | null,
    userId: null,
    serviceId: null,
    issueDescription: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerReportService: CustomerReportService,
    private userStorageService: UserStorageService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private userService: UserService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private sharedDataService: SharedDataService,
    private http: HttpClient
  ) {
    this.loadCustomers();
  }

  ngOnInit(): void {
    const reportId = this.route.snapshot.paramMap.get('id');
    if (reportId) {
      this.loadReport(+reportId);
      this.loadMechanics();
    }
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data.map(customer => ({
          ...customer,
          fullName: `${customer.firstname} ${customer.lastname}`
        }));
      },
      error: (error) => console.error('Error fetching customers:', error)
    });
  }

  loadVehicles(): void {
    if (this.reportForm.customerId) {
      this.vehicleService.getVehiclesByCustomerId(this.reportForm.customerId).subscribe({
        next: (data) => {
          this.vehicles = data.map(vehicle => ({
            ...vehicle,
            vehicleInfo: `${vehicle.manufacturer} ${vehicle.model} (${vehicle.vehiclePlate})`
          }));
        },
        error: (error) => console.error('Error fetching vehicles by customer:', error)
      });
    } else {
      this.vehicleService.getAllVehicles().subscribe({
        next: (data) => {
          this.vehicles = data.map(vehicle => ({
            ...vehicle,
            vehicleInfo: `${vehicle.manufacturer} ${vehicle.model} (${vehicle.vehiclePlate})`
          }));
        },
        error: (error) => console.error('Error fetching vehicles:', error)
      });
    }
  }

  onCustomerChange(): void {
    this.reportForm.vehicleId = null;
    this.loadVehicles();
  }

  canUpdateStatus(): boolean {
    return this.userStorageService.isAdmin() || this.userStorageService.isMechanic() || this.userStorageService.isReceptionist();
  }

  canDeleteReport(): boolean {
    if (!this.report) return false;
    return this.userStorageService.isAdmin() || this.report.createdBy === this.getCurrentUserEmail();
  }

  getCurrentUserEmail(): string {
    const user = this.userStorageService.getUser();
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.email || '';
    }
    return '';
  }

  loadReport(id: number): void {
    this.isLoading = true;
    this.customerReportService.getReportById(id).subscribe({
      next: (data) => {
        this.report = data;
        this.reportForm = {
          customerId: data.customerId || null,
          vehicleId: data.vehicleId || null,
          status: data.status || null,
          userId: data.userId || null,
          assignedServiceRequestId: data.assignedServiceRequestId || '',
          issueDescription: data.issueDescription || ''
        };

        if (data.serviceId) {
          this.sharedDataService.setCustomerReportServiceId(data.serviceId);
        }

        if (data.userId) {
          this.loadUserById(data.userId);
        }

        this.loadVehicles();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading report:', error);
        this.snackBar.open('Error loading report', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadMechanics(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.mechanics = data
          .filter(user => user.role === 'MECHANIC' || user.role === 'ADMIN')
          .map(user => ({
            ...user,
            fullName: `${user.firstname} ${user.lastname}`
          }));

        if (this.report?.userId) {
          const assignedUser = this.mechanics.find(m => m.id === this.report?.userId);
          if (assignedUser) {
            this.report!.assignedToName = assignedUser.fullName;
          }
        }
      },
      error: (error) => {
        console.error('Error loading mechanics:', error);
      }
    });
  }

  loadUserById(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        if (this.report) {
          this.report.assignedToName = `${user.firstname} ${user.lastname}`;
        }
      },
      error: (error) => {
        console.error('Error loading user by ID:', error);
      }
    });
  }

  createServiceFromReport(): void {
    if (!this.report) return;

    const serviceData = {
      vehicleId: this.report.vehicleId,
      startDate: new Date().toISOString().split('T')[0],
      customerReportId: this.report.id,
      issueDescription: this.report.issueDescription
    };

    this.sharedDataService.setCustomerReportData(serviceData);
    this.router.navigate(['/create-service'], { queryParams: { vehicleId: this.report.vehicleId } });
  }

  showEmailConfirmationDialog(): void {
    const dialogRef = this.dialog.open(EmailConfirmationDialogComponent, {
      width: '500px',
      panelClass: 'email-dialog-container',
      data: {
        customerName: this.report?.customerName || 'N/A',
        customerEmail: this.report?.customerEmail || 'N/A',
        vehicleInfo: this.report?.vehicleInfo || 'N/A',
        issueDescription: this.report?.issueDescription || 'N/A',
        status: this.report?.status || 'N/A'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendServiceEmailAndUpdateStatus();
      }
    });
  }

  sendServiceEmailAndUpdateStatus(): void {
    if (!this.report) return;

    if ((this.report as any).serviceId) {
      this.http.get(`${environment.apiUrl}services/id/${(this.report as any).serviceId}`).subscribe({
        next: (service: any) => {
          this.sendEmailWithServiceData(service);
        },
        error: (error) => {
          console.error('Error fetching service details:', error);
          this.sendEmailWithReportData();
        }
      });
    } else {
      this.sendEmailWithReportData();
    }
  }

  sendEmailWithServiceData(service: any): void {
    const emailData = {
      customerEmail: this.report?.customerEmail,
      customerName: this.report?.customerName,
      invoiceCode: service.invoiceCode || 'N/A',
      vehicleManufacturerAndModel: service.vehicleDto ? `${service.vehicleDto.manufacturer} ${service.vehicleDto.model} (${service.vehicleDto.vehiclePlate})` : 'N/A'
    };

    this.http.post(`${environment.apiUrl}email-customer`, emailData, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', '*/*'),
      observe: 'response',
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.snackBar.open('Service email sent successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });

        this.updateReportStatus();
      },
      error: (error) => {
        console.error('Error sending email:', error);
        this.snackBar.open('Failed to send service email', 'Close', {
          duration: 5000,
          verticalPosition: 'bottom'
        });
      }
    });
  }

  sendEmailWithReportData(): void {
    const emailData = {
      customerEmail: this.report?.customerEmail,
      customerName: this.report?.customerName,
      invoiceCode: 'N/A',
      vehicleManufacturerAndModel: this.report?.vehicleInfo || 'N/A'
    };

    this.http.post(`${environment.apiUrl}email-customer`, emailData, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', '*/*'),
      observe: 'response',
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.snackBar.open('Service email sent successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });

        this.updateReportStatus();
      },
      error: (error) => {
        console.error('Error sending email:', error);
        this.snackBar.open('Failed to send service email', 'Close', {
          duration: 5000,
          verticalPosition: 'bottom'
        });
      }
    });
  }

  updateReportStatus(): void {
    if (!this.report || !this.canUpdateStatus()) return;

    this.isUpdating = true;
    const updateData: CustomerReportUpdateDto = {
      status: CustomerReportStatus.COMPLETED,
      customerId: this.reportForm.customerId,
      vehicleId: this.reportForm.vehicleId,
      userId: this.reportForm.userId,
      serviceId: this.reportForm.serviceId,
      issueDescription: this.reportForm.issueDescription
    };

    this.customerReportService.updateReport(this.report.id, updateData).subscribe({
      next: (data) => {
        this.report = data;
        this.reportForm = {
          customerId: data.customerId || null,
          vehicleId: data.vehicleId || null,
          status: data.status || null,
          userId: data.userId || null,
          assignedServiceRequestId: data.assignedServiceRequestId || '',
          issueDescription: data.issueDescription || ''
        };
        this.isUpdating = false;
        this.snackBar.open('Report status updated to COMPLETED', 'Close', { duration: 3000 });

        if ((this.report as any).serviceId) {
          this.updateServiceEndDate((this.report as any).serviceId);
        }
      },
      error: (error) => {
        console.error('Error updating report:', error);
        this.snackBar.open('Error updating report status', 'Close', { duration: 3000 });
        this.isUpdating = false;
      }
    });
  }

  updateServiceEndDate(serviceId: number): void {
    this.http.get(`${environment.apiUrl}services/id/${serviceId}`).subscribe({
      next: (service: any) => {
        const currentDate = new Date().toLocaleDateString('en-CA', {
          timeZone: 'Europe/Belgrade',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

        const updateData = {
          id: serviceId,
          startDate: service.startDate,
          endDate: currentDate,
          currentMileage: service.currentMileage,
          nextServiceMileage: service.nextServiceMileage,
          vehicleId: service.vehicleDto?.id,
          userId: service.userDto?.id
        };

        this.http.put(`${environment.apiUrl}services/id/${serviceId}`, updateData, {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
        }).subscribe({
          next: () => {
          },
          error: (error) => {
            console.error('Error updating service end date:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching service data:', error);
      }
    });
  }

  updateReport(): void {
    if (!this.report || !this.canUpdateStatus()) return;

    this.isUpdating = true;
    const updateData: CustomerReportUpdateDto = {
      status: this.reportForm.status,
      customerId: this.reportForm.customerId,
      vehicleId: this.reportForm.vehicleId,
      userId: this.reportForm.userId,
      serviceId: this.reportForm.serviceId,
      issueDescription: this.reportForm.issueDescription
    };

    this.customerReportService.updateReport(this.report.id, updateData).subscribe({
      next: (data) => {
        this.report = data;
        this.reportForm = {
          customerId: data.customerId || null,
          vehicleId: data.vehicleId || null,
          status: data.status || null,
          userId: data.userId || null,
          assignedServiceRequestId: data.assignedServiceRequestId || '',
          issueDescription: data.issueDescription || ''
        };
        this.isUpdating = false;
        this.snackBar.open('Report updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating report:', error);
        this.snackBar.open('Error updating report', 'Close', { duration: 3000 });
        this.isUpdating = false;
      }
    });
  }

  deleteReport(): void {
    if (!this.report || !this.canDeleteReport()) return;

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerReportService.deleteReport(this.report!.id).subscribe({
          next: () => {
            this.snackBar.open('Report deleted successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/customer-reports']);
          },
          error: (error) => {
            console.error('Error deleting report:', error);
            this.snackBar.open('Error deleting report', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/customer-reports']);
  }

  getStatusColor(status: CustomerReportStatus | string): string {
    switch (status) {
      case CustomerReportStatus.PENDING:
        return 'pending';
      case CustomerReportStatus.ASSIGNED:
        return 'assigned';
      case CustomerReportStatus.COMPLETED:
        return 'completed';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPhotoUrls(): string[] {
    if (!this.report || !this.report.photoUrls) return [];
    return this.report.photoUrls.split(',').filter(url => url.trim());
  }

  hasPhotos(): boolean {
    return this.getPhotoUrls().length > 0;
  }



  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  selectStatus(status: CustomerReportStatus): void {
    if (!this.isStatusTransitionInvalid(this.report?.status, status)) {
      if (status === CustomerReportStatus.ASSIGNED) {
        this.createServiceFromReport();
      } else if (status === CustomerReportStatus.COMPLETED) {
        this.showEmailConfirmationDialog();
      } else {
        this.reportForm.status = status;
      }
    }
  }

  isStatusTransitionInvalid(currentStatus: CustomerReportStatus | undefined, newStatus: CustomerReportStatus): boolean {
    if (!currentStatus) return false;

    const validTransitions: Record<CustomerReportStatus, CustomerReportStatus[]> = {
      [CustomerReportStatus.PENDING]: [CustomerReportStatus.ASSIGNED, CustomerReportStatus.COMPLETED],
      [CustomerReportStatus.ASSIGNED]: [CustomerReportStatus.COMPLETED],
      [CustomerReportStatus.COMPLETED]: []
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    return !allowedTransitions.includes(newStatus);
  }

  getStatusIcon(status: CustomerReportStatus): string {
    const icons: Record<CustomerReportStatus, string> = {
      [CustomerReportStatus.PENDING]: 'fa-clock',
      [CustomerReportStatus.ASSIGNED]: 'fa-user',
      [CustomerReportStatus.COMPLETED]: 'fa-check-circle'
    };
    return icons[status] || 'fa-circle';
  }

  getStatusDescription(status: CustomerReportStatus): string {
    const descriptions: Record<CustomerReportStatus, string> = {
      [CustomerReportStatus.PENDING]: 'Awaiting review and processing',
      [CustomerReportStatus.ASSIGNED]: 'Assigned to a mechanic',
      [CustomerReportStatus.COMPLETED]: 'Work completed successfully'
    };
    return descriptions[status] || '';
  }
}
