import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { environment } from '../../../environments/environment';
import { YearSpinnerDirective } from '../create-vehicle/year-spinner.directive';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgSelectModule,
    MatSlideToggleModule,
    YearSpinnerDirective,
    RouterModule
  ],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  @ViewChild('customerInput') customerInput!: ElementRef<HTMLInputElement>;
  isDropdownFocused = false;
  currentPage = 0;
  pageSize = 5;
  totalItems = 0;
  isDeleted = false;
  vehicles: any[] = [];
  customers: any[] = [];
  sortBy: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  isMobileSearchOpen = false;

  manufacturerControl = new FormControl('');
  modelControl = new FormControl('');
  vehiclePlateControl = new FormControl('');
  vinControl = new FormControl('');
  yearControl = new FormControl('');
  customerControl = new FormControl(null);

  selectedCustomerId: number | null = null;

  vehicle: any = {
    id: null,
    manufacturer: '',
    model: '',
    vehiclePlate: '',
    vin: '',
    yearOfManufacture: null,
    customerId: null,
    customerDto: {
      phoneNumber: '',
      firstname: '',
      lastname: ''
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedCustomerId = params.get('customerId') ? +params.get('customerId')! : null;
      this.currentPage = +this.route.snapshot.queryParamMap.get('page')! || 0;
      this.pageSize = +this.route.snapshot.queryParamMap.get('pageSize')! || 5;

      this.getVehicles();
    });

    this.setupSearchControls();
  }

  setupSearchControls(): void {
    const controls = [
      this.manufacturerControl,
      this.modelControl,
      this.vehiclePlateControl,
      this.vinControl,
      this.yearControl,
      this.customerControl
    ];

    controls.forEach(control => {
      control.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => this.onSearchChange());
    });
  }

  getVehicles(): void {
    const vehicleFiltersQueryDto = {
      manufacturer: this.manufacturerControl.value,
      model: this.modelControl.value,
      vehiclePlate: this.vehiclePlateControl.value,
      vin: this.vinControl.value,
      yearOfManufacture: this.yearControl.value,
      customerId: this.selectedCustomerId !== null ? this.selectedCustomerId : undefined,
      isDeleted: this.isDeleted,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };

    this.http.post<any>(`${BASIC_URL}vehicles/search?page=${this.currentPage}&pageSize=${this.pageSize}`,
      vehicleFiltersQueryDto,
      {
        observe: 'response'
      }
    ).subscribe({
      next: (response: HttpResponse<any>) => {
        this.vehicles = response.body;
        this.totalItems = parseInt(response.headers.get('x-total-items') || '0', 10);
      },
      error: (error) => console.error('Error fetching vehicles:', error)
    });
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.http.get<any[]>(`${BASIC_URL}customers`).subscribe({
      next: (data) => {
        this.customers = data.map(customer => ({
          ...customer,
          fullName: `${customer.firstname} ${customer.lastname}`
        }));
      },
      error: (error) => console.error('Error fetching customers:', error)
    });
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

  onSearchChange(): void {
    this.currentPage = 0;
    this.getVehicles();
  }

  getVehicleById(id: number): void {
    this.router.navigate([`/vehicles`, id]);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, pageSize: this.pageSize },
      queryParamsHandling: 'merge'
    });

    this.getVehicles();
  }

  onToggleChange(event: any): void {
    this.isDeleted = event.checked;
    this.currentPage = 0;
    this.getVehicles();
  }

  sort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.getVehicles();
  }

  toggleMobileSearch(): void {
    this.isMobileSearchOpen = !this.isMobileSearchOpen;
  }
}
