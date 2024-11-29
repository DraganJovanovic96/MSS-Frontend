import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerVehicleDialogComponent } from '../../customer-vehicle-dialog/customer-vehicle-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-email-customer',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './email-customer.component.html',
  styleUrl: './email-customer.component.scss'
})
@Injectable({
  providedIn: 'root',
})
export class EmailCustomerComponent implements OnInit {
  services: any[] = [];
  customers: any[] = [];
  serviceTypeDtos: any[] = [];
  users: any[] = [];
  vehicles: any[] = [];
  isDeleted = false;

  invoiceCodeControl = new FormControl('');
  startDateControl = new FormControl(null);
  endDateControl = new FormControl(null);
  vehicleControl = new FormControl(null);
  userControl = new FormControl(null);
  customerControl = new FormControl(null);

  selectedVehicleId: number | null = null;
  selectedCustomerId: number | null = null;
  selectedUserId: number | null = null;

  service: any = {
    id: null,
    invoiceCode: '',
    startDate: null,
    endDate: '',
    currentMileage: '',
    vehicleDto: {
      model: '',
      manufacturer: '',
      customerDto: {
        firstname: '',
        lastname: ''
      }
    },
    userDto: {
      firstname: '',
      lastname: ''
    },
    serviceTypeDtos: {
      description: ''
    }
  }

  currentPage = 0;
  pageSize = 5;
  totalItems = 0;
  isDropdownFocused = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedVehicleId = params.get('vehicleId') ? +params.get('vehicleId')! : null;
      this.selectedUserId = params.get('userId') ? +params.get('userId')! : null;
      this.currentPage = +this.route.snapshot.queryParamMap.get('page')! || 0;
      this.pageSize = +this.route.snapshot.queryParamMap.get('pageSize')! || 5;

      this.loadUsers();
      this.loadVehicles();
      this.loadCustomers();
      this.getServices();
    });

    this.setupSearchControls();
  }

  sendEmailService(emailCustomerDto: any): void {
    this.http.post(`${BASIC_URL}email-customer`, emailCustomerDto, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', '*/*'),
      observe: 'response',
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.snackBar.open('Email has been sent successfully!', 'Close', {
          duration: 5000,
          verticalPosition: 'bottom'
        });
      },
      error: () => {
        this.snackBar.open('Failed to send email. Please try again.', 'Close', {
          duration: 5000,
          verticalPosition: 'bottom'
        });
      }
    });
  }

  setupSearchControls(): void {
    const controls = [
      this.invoiceCodeControl,
      this.startDateControl,
      this.endDateControl,
      this.vehicleControl,
      this.customerControl,
      this.userControl
    ];

    controls.forEach(control => {
      control.valueChanges
        .pipe(debounceTime(350), distinctUntilChanged())
        .subscribe(() => this.onSearchChange());
    });
  }

  openCustomerVehicleDialog(service: any): void {
      const dialogRef = this.dialog.open(CustomerVehicleDialogComponent, {
          width: '350px',
          panelClass: 'custom-container',  
          data: {
              customer: service.vehicleDto.customerDto, 
              vehicle: service.vehicleDto,
              service: service
          }
      });

    dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed');
    });
}


  getServices(): void {
    const serviceFiltersQueryDto = {
      invoiceCode: this.invoiceCodeControl.value,
      startDate: this.startDateControl.value,
      customerId: this.customerControl.value,
      endDate: this.endDateControl.value,
      vehicleId: this.selectedVehicleId !== null ? this.selectedVehicleId : undefined,
      userId: this.selectedUserId !== null ? this.selectedUserId : undefined,
      isDeleted: this.isDeleted
    };

    this.http.post<any>(`${BASIC_URL}services/search-with-customer?page=${this.currentPage}&pageSize=${this.pageSize}`,
      serviceFiltersQueryDto,
      {
        observe: 'response'
      }
    ).subscribe({
      next: (response: HttpResponse<any>) => {
        this.services = response.body;
        this.totalItems = parseInt(response.headers.get('x-total-items') || '0', 10);
      },
      error: (error) => console.error('Error fetching services:', error)
    });
  }


  loadUsers(): void {
    this.http.get<any[]>(`${BASIC_URL}users`).subscribe({
      next: (data) => {
        this.users = data.map(user => ({
          ...user,
          fullName: `${user.firstname} ${user.lastname}`
        }));
      },
      error: (error) => console.error('Error fetching users:', error)
    });
  }

  loadVehicles(): void {
    this.http.get<any[]>(`${BASIC_URL}vehicles`).subscribe({
      next: (data) => {
        this.vehicles = data.map(vehicle => ({
          ...vehicle,
          fullName: `${vehicle.manufacturer} ${vehicle.model}`
        }));
      },
      error: (error) => console.error('Error fetching vehicles:', error)
    });
  }

  loadCustomers(): void {
    this.http.get<any[]>(`${BASIC_URL}customers`).subscribe({
      next: (data) => {
        this.customers = data.map(customer => ({
          ...customer,
          fullName: `${customer.firstname} ${customer.lastname}`
        }));
      },
      error: (error) => console.error('Error fetching vehicles:', error)
    });
  }

  onVehicleInputChange(event: any): void {
    const inputValue = this.vehicleControl.value;

    const parsedId = inputValue ? parseInt(inputValue, 10) : null;

    if (parsedId !== null && !isNaN(parsedId)) {
      this.selectedVehicleId = parsedId;
    } else {
      this.selectedVehicleId = null;
    }

    this.onSearchChange();
  }

  onCustomerInputChange(event: any): void {
    const inputValue = this.customerControl.value;

    const parsedId = inputValue ? parseInt(inputValue, 10) : null;

    if (parsedId !== null && !isNaN(parsedId)) {
      this.selectedCustomerId = parsedId;
    } else {
      this.selectedCustomerId = null;
    }

    this.onSearchChange();
  }

  onUserInputChange(event: any): void {
    const inputValue = this.userControl.value;

    const parsedId = inputValue ? parseInt(inputValue, 10) : null;

    if (parsedId !== null && !isNaN(parsedId)) {
      this.selectedUserId = parsedId;
    } else {
      this.selectedUserId = null;
    }

    this.onSearchChange();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.getServices();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, pageSize: this.pageSize },
      queryParamsHandling: 'merge'
    });

    this.getServices();
  }

  onToggleChange(event: any): void {
    this.isDeleted = event.checked;
    this.currentPage = 0;
    this.getServices(); 
  }
}
