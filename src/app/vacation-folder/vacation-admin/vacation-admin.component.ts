import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { VacationService, VacationRequest } from '../../services/vacation.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-vacation-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './vacation-admin.component.html',
  styleUrls: ['./vacation-admin.component.scss']
})
export class VacationAdminComponent implements OnInit {
  allRequests: VacationRequest[] = [];
  pendingRequests: VacationRequest[] = [];
  isLoading = false;

  statusFilter: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' = 'ALL';
  employeeFilter: string = '';

  statusOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  totalPending = 0;
  totalApprovedCount = 0;
  activeTimeOff = 0;

  selectedRequest: VacationRequest | null = null;
  rejectionReason: string = '';
  showApprovalModal = false;

  showDetailsModal = false;

  isMobileFiltersOpen = false;

  constructor(
    private vacationService: VacationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllRequests();
    this.loadPendingRequests();
  }

  loadAllRequests(): void {
    this.isLoading = true;
    this.vacationService.getAllVacationRequests().subscribe({
      next: (data) => {
        this.allRequests = data;
        this.isLoading = false;
        this.loadStatistics();
      },
      error: (error) => {
        console.error('Error loading time off requests:', error);
        this.snackBar.open('Error loading time off requests', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.isLoading = false;
      }
    });
  }

  loadPendingRequests(): void {
    this.vacationService.getPendingVacationRequests().subscribe({
      next: (data) => {
        this.pendingRequests = data;
        this.totalPending = data.length;
      },
      error: (error) => {
      }
    });
  }

  loadStatistics(): void {
    this.totalApprovedCount = this.allRequests.filter(req => req.status === 'APPROVED').length;
    this.activeTimeOff = this.allRequests.filter(req => req.status === 'APPROVED' && this.isCurrentlyActive(req)).length;
  }

  private isCurrentlyActive(request: VacationRequest): boolean {
    const now = new Date();
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    return now >= startDate && now <= endDate;
  }

  get filteredRequests(): VacationRequest[] {
    return this.allRequests.filter(request => {
      const statusMatch = this.statusFilter === 'ALL' || request.status === this.statusFilter;
      const employeeMatch = !this.employeeFilter || 
        (request.employee && 
         `${request.employee.firstname} ${request.employee.lastname}`.toLowerCase().includes(this.employeeFilter.toLowerCase()));
      
      return statusMatch && employeeMatch;
    });
  }

  openApprovalModal(request: VacationRequest): void {
    this.selectedRequest = request;
    this.rejectionReason = '';
    this.showApprovalModal = true;
  }

  approveRequestDirectly(request: VacationRequest): void {
    this.vacationService.updateVacationRequest(request.id!, {
      status: 'APPROVED'
    }).subscribe({
      next: () => {
        this.snackBar.open('Time off request approved', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.loadAllRequests();
        this.loadPendingRequests();
        this.loadStatistics();
      },
      error: (error) => {
        console.error('Error approving request:', error);
        this.snackBar.open('Error approving request', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
      }
    });
  }

  closeApprovalModal(): void {
    this.selectedRequest = null;
    this.rejectionReason = '';
    this.showApprovalModal = false;
  }

  approveRequest(): void {
    if (!this.selectedRequest) return;

    this.vacationService.updateVacationRequest(this.selectedRequest.id!, {
      status: 'APPROVED'
    }).subscribe({
      next: () => {
        this.snackBar.open('Time off request approved', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.closeApprovalModal();
        this.loadAllRequests();
        this.loadPendingRequests();
        this.loadStatistics();
      },
      error: (error) => {
        console.error('Error approving request:', error);
        this.snackBar.open('Error approving request', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
      }
    });
  }

  rejectRequest(): void {
    if (!this.selectedRequest) return;

    if (!this.rejectionReason.trim()) {
      this.snackBar.open('Please provide a rejection reason', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom'
      });
      return;
    }

    this.vacationService.updateVacationRequest(this.selectedRequest.id!, {
      status: 'REJECTED',
      rejectionReason: this.rejectionReason
    }).subscribe({
      next: () => {
        this.snackBar.open('Time off request rejected', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.closeApprovalModal();
        this.loadAllRequests();
        this.loadPendingRequests();
        this.loadStatistics();
      },
      error: (error) => {
        console.error('Error rejecting request:', error);
        this.snackBar.open('Error rejecting request', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
      }
    });
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  onStatusFilterChange(): void {
  }

  showRequestDetails(request: VacationRequest): void {
    this.selectedRequest = request;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedRequest = null;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }
}
