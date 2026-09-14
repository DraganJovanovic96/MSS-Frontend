import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerReportService, CustomerReportDto } from '../../services/customer-report/customer-report.service';
import { UserStorageService } from '../../services/storage/user-storage.service';

@Component({
  selector: 'app-customer-report-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule
  ],
  templateUrl: './customer-report-list.component.html',
  styleUrls: ['./customer-report-list.component.scss']
})
export class CustomerReportListComponent implements OnInit {
  myReports: CustomerReportDto[] = [];
  allReports: CustomerReportDto[] = [];
  pendingReports: CustomerReportDto[] = [];
  isLoadingMyReports = false;
  isLoadingAllReports = false;
  isLoadingPendingReports = false;
  selectedTab = 0;

  myReportsPage = 0;
  myReportsSize = 6;
  myReportsTotalElements = 0;
  myReportsTotalPages = 0;

  allReportsPage = 0;
  allReportsSize = 6;
  allReportsTotalElements = 0;
  allReportsTotalPages = 0;

  pendingReportsPage = 0;
  pendingReportsSize = 6;
  pendingReportsTotalElements = 0;
  pendingReportsTotalPages = 0;

  constructor(
    private customerReportService: CustomerReportService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userStorageService: UserStorageService
  ) {}

  ngOnInit(): void {
    this.loadMyReports();

    if (this.canViewAllReports()) {
      this.loadAllReports();
    }

    if (this.canViewPendingReports()) {
      this.loadPendingReports();
    }
  }

  canViewAllReports(): boolean {
    return this.userStorageService.isAdmin() ||
           this.userStorageService.isReceptionist() ||
           this.userStorageService.isMechanic();
  }

  canViewPendingReports(): boolean {
    return this.userStorageService.isAdmin() ||
           this.userStorageService.isReceptionist() ||
           this.userStorageService.isMechanic();
  }

  canCreateReport(): boolean {
    return this.userStorageService.isReceptionist() || this.userStorageService.isAdmin();
  }

  canDeleteReport(report: CustomerReportDto): boolean {
    return this.userStorageService.isAdmin() || report.createdBy === this.getCurrentUserEmail();
  }

  getCurrentUserEmail(): string {
    const user = this.userStorageService.getUser();
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.email || '';
    }
    return '';
  }

  loadMyReports(): void {
    this.isLoadingMyReports = true;
    this.customerReportService.getMyReports(this.myReportsPage, this.myReportsSize).subscribe({
      next: (response) => {
        this.myReports = response.body || [];
        this.myReportsTotalElements = parseInt(response.headers.get('X-Total-Items') || '0');
        this.myReportsTotalPages = parseInt(response.headers.get('X-Total-Pages') || '0');
        this.isLoadingMyReports = false;
      },
      error: (error) => {
        console.error('Error loading my reports:', error);
        this.snackBar.open('Error loading your reports', 'Close', { duration: 3000 });
        this.isLoadingMyReports = false;
      }
    });
  }

  loadAllReports(): void {
    this.isLoadingAllReports = true;
    this.customerReportService.getAllReports(this.allReportsPage, this.allReportsSize).subscribe({
      next: (response) => {
        this.allReports = response.body || [];
        this.allReportsTotalElements = parseInt(response.headers.get('X-Total-Items') || '0');
        this.allReportsTotalPages = parseInt(response.headers.get('X-Total-Pages') || '0');
        this.isLoadingAllReports = false;
      },
      error: (error) => {
        console.error('Error loading all reports:', error);
        this.snackBar.open('Error loading reports', 'Close', { duration: 3000 });
        this.isLoadingAllReports = false;
      }
    });
  }

  loadPendingReports(): void {
    this.isLoadingPendingReports = true;
    this.customerReportService.getPendingReports(this.pendingReportsPage, this.pendingReportsSize).subscribe({
      next: (response) => {
        this.pendingReports = response.body || [];
        this.pendingReportsTotalElements = parseInt(response.headers.get('X-Total-Items') || '0');
        this.pendingReportsTotalPages = parseInt(response.headers.get('X-Total-Pages') || '0');
        this.isLoadingPendingReports = false;
      },
      error: (error) => {
        console.error('Error loading pending reports:', error);
        this.snackBar.open('Error loading pending reports', 'Close', { duration: 3000 });
        this.isLoadingPendingReports = false;
      }
    });
  }

  viewReport(reportId: number): void {
    this.router.navigate(['/customer-reports', reportId]);
  }

  createReport(): void {
    this.router.navigate(['/customer-reports/new']);
  }

  deleteReport(report: CustomerReportDto): void {
    if (!this.canDeleteReport(report)) {
      this.snackBar.open('You do not have permission to delete this report', 'Close', { duration: 3000 });
      return;
    }

    if (confirm('Are you sure you want to delete this report?')) {
      this.customerReportService.deleteReport(report.id).subscribe({
        next: () => {
          this.snackBar.open('Report deleted successfully', 'Close', { duration: 3000 });
          this.refreshCurrentTab();
        },
        error: (error) => {
          console.error('Error deleting report:', error);
          this.snackBar.open('Error deleting report', 'Close', { duration: 3000 });
        }
      });
    }
  }

  refreshCurrentTab(): void {
    switch (this.selectedTab) {
      case 0:
        this.myReportsPage = 0;
        this.loadMyReports();
        break;
      case 1:
        if (this.canViewAllReports()) {
          this.allReportsPage = 0;
          this.loadAllReports();
        }
        break;
      case 2:
        if (this.canViewPendingReports()) {
          this.pendingReportsPage = 0;
          this.loadPendingReports();
        }
        break;
    }
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  myReportsPreviousPage(): void {
    if (this.myReportsPage > 0) {
      this.myReportsPage--;
      this.loadMyReports();
    }
  }

  myReportsNextPage(): void {
    if (this.myReportsPage < this.myReportsTotalPages - 1) {
      this.myReportsPage++;
      this.loadMyReports();
    }
  }

  myReportsFirstPage(): void {
    this.myReportsPage = 0;
    this.loadMyReports();
  }

  myReportsLastPage(): void {
    this.myReportsPage = this.myReportsTotalPages - 1;
    this.loadMyReports();
  }

  allReportsPreviousPage(): void {
    if (this.allReportsPage > 0) {
      this.allReportsPage--;
      this.loadAllReports();
    }
  }

  allReportsNextPage(): void {
    if (this.allReportsPage < this.allReportsTotalPages - 1) {
      this.allReportsPage++;
      this.loadAllReports();
    }
  }

  allReportsFirstPage(): void {
    this.allReportsPage = 0;
    this.loadAllReports();
  }

  allReportsLastPage(): void {
    this.allReportsPage = this.allReportsTotalPages - 1;
    this.loadAllReports();
  }

  pendingReportsPreviousPage(): void {
    if (this.pendingReportsPage > 0) {
      this.pendingReportsPage--;
      this.loadPendingReports();
    }
  }

  pendingReportsNextPage(): void {
    if (this.pendingReportsPage < this.pendingReportsTotalPages - 1) {
      this.pendingReportsPage++;
      this.loadPendingReports();
    }
  }

  pendingReportsFirstPage(): void {
    this.pendingReportsPage = 0;
    this.loadPendingReports();
  }

  pendingReportsLastPage(): void {
    this.pendingReportsPage = this.pendingReportsTotalPages - 1;
    this.loadPendingReports();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'pending';
      case 'ASSIGNED':
        return 'assigned';
      case 'COMPLETED':
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

  getPhotoUrls(report: CustomerReportDto): string[] {
    if (!report.photoUrls) return [];
    return report.photoUrls.split(',').filter(url => url.trim());
  }

  hasPhotos(report: CustomerReportDto): boolean {
    return this.getPhotoUrls(report).length > 0;
  }
}
