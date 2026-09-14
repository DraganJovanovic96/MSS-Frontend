import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedDataService } from '../../services/SharedDataService';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterModule, CommonModule]
})
export class SidebarComponent implements OnInit, OnDestroy {
  customerId: number | null = null;
  vehicleId: number | null = null;
  serviceId: number | null = null;
  serviceVehicleId: number | null = null;
  customerReportServiceId: number | null = null;
  serviceCustomerReportId: number | null = null;
  isMobileSidebarOpen = false;

  private customerIdSub!: Subscription;
  private vehicleIdSub!: Subscription;
  private serviceIdSub!: Subscription;
  private serviceVehicleIdSub!: Subscription;
  private customerReportServiceIdSub!: Subscription;
  private serviceCustomerReportIdSub!: Subscription;
  private mobileSidebarOpenSub!: Subscription;

  constructor(
    private sharedDataService: SharedDataService,
    private userStorageService: UserStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerIdSub = this.sharedDataService.customerId$.subscribe(id => {
      this.customerId = id;
    });

    this.vehicleIdSub = this.sharedDataService.vehicleId$.subscribe(id => {
      this.vehicleId = id;
    });

    this.serviceIdSub = this.sharedDataService.serviceId$.subscribe(id => {
      this.serviceId = id;
    });

    this.serviceVehicleIdSub = this.sharedDataService.serviceVehicleId$.subscribe(id => {
      this.serviceVehicleId = id;
    });

    this.customerReportServiceIdSub = this.sharedDataService.customerReportServiceId$.subscribe(id => {
      this.customerReportServiceId = id;
    });

    this.serviceCustomerReportIdSub = this.sharedDataService.serviceCustomerReportId$.subscribe(id => {
      this.serviceCustomerReportId = id;
    });

    this.mobileSidebarOpenSub = this.sharedDataService.mobileSidebarOpen$.subscribe(isOpen => {
      this.isMobileSidebarOpen = isOpen;
    });
  }

  ngOnDestroy(): void {
    this.customerIdSub.unsubscribe();
    this.vehicleIdSub.unsubscribe();
    this.serviceIdSub.unsubscribe();
    this.serviceVehicleIdSub.unsubscribe();
    this.customerReportServiceIdSub.unsubscribe();
    this.serviceCustomerReportIdSub.unsubscribe();
    this.mobileSidebarOpenSub.unsubscribe();
  }

  isAdmin(): boolean {
    const user = this.userStorageService.getUser();
    if (user) {
      const parsedUser = JSON.parse(user as string);
      return parsedUser.role === 'ADMIN';
    }
    return false;
  }

  hasCompletedFirstTimeSetup(): boolean {
    return this.userStorageService.isFirstTimeSetupCompleted();
  }

  getCurrentContext(): string {
    const path = this.currentPath();

    if (path.startsWith('/admin') || path.startsWith('/revenue') || path.startsWith('/email') || path.startsWith('/create-user') || path.startsWith('/update-user') || path.startsWith('/admin-users') || path.startsWith('/vacation-admin')) return 'admin';
    if (path.startsWith('/vehicles') && !path.startsWith('/vehicles/customer')) return 'vehicle';
    if (path.startsWith('/customers')) return 'customer';
    if (path.startsWith('/customer-reports')) return 'customer-reports';
    if (path.startsWith('/services') || path === '/create-service' || path.startsWith('/create-service/')) return 'service';
    if (path.startsWith('/service-types') || path === '/create-service-type' || path.startsWith('/create-service-type/')) return 'service';

    if (this.vehicleId && !path.startsWith('/admin')) return 'vehicle';
    if (this.customerId && !path.startsWith('/admin')) return 'customer';
    if (this.serviceId && !path.startsWith('/admin')) return 'service';
    if (this.customerReportServiceId && !path.startsWith('/admin')) return 'customer-reports';

    return 'none';
  }

  shouldShowCreateCustomer(): boolean {
    const context = this.getCurrentContext();
    return context === 'customer';
  }

  shouldShowCreateVehicle(): boolean {
    const context = this.getCurrentContext();
    return context === 'vehicle';
  }

  shouldShowCreateService(): boolean {
    const context = this.getCurrentContext();
    return context === 'service';
  }

  shouldShowCreateServiceType(): boolean {
    const context = this.getCurrentContext();
    return context === 'service';
  }

  canCreateReport(): boolean {
    return this.userStorageService.isReceptionist() || this.userStorageService.isAdmin();
  }

  isDashboardActive(): boolean {
    const path = this.currentPath();
    return path === '/' || path === '/dashboard';
  }

  isCustomersActive(): boolean {
    const path = this.currentPath();
    return path.startsWith('/customers') || path.startsWith('/create-customer');
  }

  isVehiclesActive(): boolean {
    const path = this.currentPath();
    return path.startsWith('/vehicles') || path.startsWith('/create-vehicle');
  }

  isServicesActive(): boolean {
    const path = this.currentPath();
    return path.startsWith('/services') ||
      path === '/create-service' ||
      path.startsWith('/create-service/');
  }

  isServiceTypesActive(): boolean {
    const path = this.currentPath();
    return path.startsWith('/service-types') || path.startsWith('/create-service-type');
  }

  isAdminActive(): boolean {
    const path = this.currentPath();
    return path.startsWith('/admin') ||
      path.startsWith('/revenue') ||
      path.startsWith('/email') ||
      path.startsWith('/create-user');
  }

  isVacationRequestsActive(): boolean {
    const path = this.currentPath();
    return path.startsWith('/vacation-requests');
  }

  isCustomerReportsActive(): boolean {
    const path = this.currentPath();
    return path.startsWith('/customer-reports');
  }

  isVacationAdminActive(): boolean {
    const path = this.currentPath();
    return path.startsWith('/vacation-admin');
  }

  private currentPath(): string {
    return this.router.url.split('?')[0];
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
    this.sharedDataService.setMobileSidebarOpen(false);
  }
}
