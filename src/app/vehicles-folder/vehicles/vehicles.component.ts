import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ReactiveFormsModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  isDropdownFocused = false;
  currentPage = 0;
  pageSize = 5;
  totalItems = 0;
  vehicles: any[] = [];
  customers: any[] = [];
  
  manufacturerControl = new FormControl('');
  modelControl = new FormControl('');
  vehiclePlateControl = new FormControl('');
  vinControl = new FormControl('');
  yearControl = new FormControl('');
  customerControl = new FormControl('');

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
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedCustomerId = params.get('customerId') ? +params.get('customerId')! : null;
      this.currentPage = +this.route.snapshot.queryParamMap.get('page')! || 0;
      this.pageSize = +this.route.snapshot.queryParamMap.get('pageSize')! || 5;

      this.loadCustomers();
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
      customerId: this.selectedCustomerId 
    };
    
    this.http.post<any>(`${BASIC_URL}vehicles/search?page=${this.currentPage}&pageSize=${this.pageSize}`,
      vehicleFiltersQueryDto,
      {
        headers: this.authService.createAuthorizationHeader(),
        observe: 'response'
      }
    ).subscribe({
      next: (response: HttpResponse<any>) => {
        this.vehicles = response.body;
        this.totalItems = parseInt(response.headers.get('x-total-items') || '0', 10);
      },
      error: (error) => console.error('Error fetching vehicles:', error)
    });
  }

  loadCustomers(): void {
    this.http.get<any[]>(`${BASIC_URL}customers`, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => {
        this.customers = data; 
        if (this.selectedCustomerId) {
          const selectedCustomer = this.customers.find(customer => customer.id === this.selectedCustomerId);
          this.customerControl.setValue(`${selectedCustomer?.firstname} ${selectedCustomer?.lastname}`);
        }
      },
      error: (error) => console.error('Error fetching customers:', error)
    });
  }

  onSearchChange(): void {
    const selectedCustomer = this.customers.find(customer =>
      `${customer.firstname} ${customer.lastname}` === this.customerControl.value
    );
    this.selectedCustomerId = selectedCustomer ? selectedCustomer.id : null;
    
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
}
