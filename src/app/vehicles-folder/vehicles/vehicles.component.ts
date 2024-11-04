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
  imports: [CommonModule, SidebarComponent, ReactiveFormsModule, MatPaginatorModule,
    FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
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
  ) { this.loadCustomers(); }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 0;
      this.pageSize = +params['pageSize'] || 5;
      this.getVehicles();
    });

    this.manufacturerControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.modelControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.vehiclePlateControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.vinControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.yearControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.customerControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());
  }

  getVehicles(): void {
    const vehicleFiltersQueryDto = {
      manufacturer: this.manufacturerControl.value,
      model: this.modelControl.value,
      vehiclePlate: this.vehiclePlateControl.value,
      vin: this.vinControl.value,
      yearOfManufacture: this.yearControl.value,
      customerId: this.customerControl.value
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
      error: (error) => console.error('Error fetching customers:', error)
    });
  }

  loadCustomers(): void {
    this.http.get<any[]>(`${BASIC_URL}customers`, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (error) => console.error('Error fetching customers:', error)
    });
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
}
