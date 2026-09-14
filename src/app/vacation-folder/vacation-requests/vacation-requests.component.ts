import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { VacationService, VacationRequest } from '../../services/vacation.service';
import { DeleteConfirmationDialogComponent } from '../../services/DeleteConfirmationDialogComponent ';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-vacation-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vacation-requests.component.html',
  styleUrls: ['./vacation-requests.component.scss']
})
export class VacationRequestsComponent implements OnInit {
  vacationRequests: VacationRequest[] = [];
  isLoading = false;

  remainingDays = 0;
  totalAllowedDays = 22;
  usedDays = 0;
  numberOfChildren = 0;

  newRequest = {
    startDate: '',
    endDate: ''
  };

  calculatedDays = 0;
  isSubmitting = false;

  showRejectionModal = false;
  selectedRequest: VacationRequest | null = null;

  constructor(
    private vacationService: VacationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private userStorageService: UserStorageService
  ) {}

  ngOnInit(): void {
    this.numberOfChildren = this.userStorageService.getNumberOfChildren();
    this.loadVacationRequests();
    this.loadVacationBalance();
  }

  loadVacationRequests(): void {
    this.isLoading = true;
    this.vacationService.getMyVacationRequests().subscribe({
      next: (data) => {
        this.vacationRequests = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading time off requests', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.isLoading = false;
      }
    });
  }

  loadVacationBalance(): void {
    const today = new Date();
    const timeOffYear = this.vacationService.getTimeOffYear(today.toISOString());

    this.vacationService.getTotalAvailableDays().subscribe({
      next: (totalAllowed) => {
        this.totalAllowedDays = totalAllowed;
        this.vacationService.getRemainingVacationDays(timeOffYear).subscribe({
          next: (remaining) => {
            this.remainingDays = remaining;
            this.usedDays = this.totalAllowedDays - remaining;
          },
          error: (error) => {
            this.remainingDays = this.totalAllowedDays;
            this.usedDays = 0;
          }
        });
      },
      error: (error) => {
        this.totalAllowedDays = 22 + this.numberOfChildren;
        this.vacationService.getRemainingVacationDays(timeOffYear).subscribe({
          next: (remaining) => {
            this.remainingDays = remaining;
            this.usedDays = this.totalAllowedDays - remaining;
          },
          error: (error) => {
            this.remainingDays = this.totalAllowedDays;
            this.usedDays = 0;
          }
        });
      }
    });
  }

  calculateDays(): void {
    if (this.newRequest.startDate && this.newRequest.endDate) {
      const start = new Date(this.newRequest.startDate);
      const end = new Date(this.newRequest.endDate);
      
      if (start > end) {
        this.calculatedDays = 0;
        return;
      }

      this.calculatedDays = this.vacationService.calculateBusinessDays(
        this.newRequest.startDate,
        this.newRequest.endDate
      );

      const timeOffYear = this.vacationService.getTimeOffYear(this.newRequest.startDate);
      this.updateBalanceForYear(timeOffYear);
    } else {
      this.calculatedDays = 0;
    }
  }

  updateBalanceForYear(timeOffYear: number): void {
    this.vacationService.getTotalAvailableDays().subscribe({
      next: (totalAllowed) => {
        this.totalAllowedDays = totalAllowed;
        this.vacationService.getRemainingVacationDays(timeOffYear).subscribe({
          next: (remaining) => {
            this.remainingDays = remaining;
            this.usedDays = this.totalAllowedDays - remaining;
          },
          error: (error) => {
            this.remainingDays = this.totalAllowedDays;
            this.usedDays = 0;
          }
        });
      },
      error: (error) => {
        this.totalAllowedDays = 22 + this.numberOfChildren;
        this.vacationService.getRemainingVacationDays(timeOffYear).subscribe({
          next: (remaining) => {
            this.remainingDays = remaining;
            this.usedDays = this.totalAllowedDays - remaining;
          },
          error: (error) => {
            this.remainingDays = this.totalAllowedDays;
            this.usedDays = 0;
          }
        });
      }
    });
  }

  onSubmitRequest(): void {
    if (!this.newRequest.startDate || !this.newRequest.endDate) {
      this.snackBar.open('Please select both start and end dates', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom'
      });
      return;
    }

    const start = new Date(this.newRequest.startDate);
    const end = new Date(this.newRequest.endDate);

    if (start > end) {
      this.snackBar.open('Start date must be before end date', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom'
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      this.snackBar.open('Start date must be in the future', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom'
      });
      return;
    }

    this.isSubmitting = true;

    this.vacationService.createVacationRequest({
      startDate: this.newRequest.startDate,
      endDate: this.newRequest.endDate
    }).subscribe({
      next: () => {
        this.snackBar.open('Time off request submitted successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.resetForm();
        this.loadVacationRequests();
        this.loadVacationBalance();
        this.isSubmitting = false;
      },
      error: (error) => {

        let errorMessage = 'Error creating time off request';
        
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        }
        
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.isSubmitting = false;
      }
    });
  }

  deleteRequest(requestId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vacationService.deleteVacationRequest(requestId).subscribe({
          next: () => {
            this.snackBar.open('Time off request deleted successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'bottom'
            });
            this.loadVacationRequests();
            this.loadVacationBalance();
          },
          error: (error) => {
            this.snackBar.open('Error deleting time off request', 'Close', {
              duration: 3000,
              verticalPosition: 'bottom'
            });
          }
        });
      }
    });
  }

  canDeleteRequest(request: VacationRequest): boolean {
    return request.status === 'PENDING';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return '';
    }
  }

  resetForm(): void {
    this.newRequest = {
      startDate: '',
      endDate: ''
    };
    this.calculatedDays = 0;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  showRejectionReason(request: VacationRequest): void {
    this.selectedRequest = request;
    this.showRejectionModal = true;
  }

  closeRejectionModal(): void {
    this.showRejectionModal = false;
    this.selectedRequest = null;
  }
}
