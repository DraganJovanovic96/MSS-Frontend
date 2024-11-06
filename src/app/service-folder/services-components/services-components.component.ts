import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-services-components',
  standalone: true,
  imports: [SidebarComponent, MatPaginatorModule, CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule],
  templateUrl: './services-components.component.html',
  styleUrl: './services-components.component.scss'
})
export class ServicesComponentsComponent implements OnInit {
  services: any[] = [];
  serviceTypeDtos: any[] = [];
  users: any[] = [];
  vehicles: any[] = [];

  invoiceCodeControl = new FormControl('');
  startDateControl = new FormControl(null);
  endDateControl = new FormControl(null);
  vehicleControl = new FormControl('');
  userControl = new FormControl('');

  selectedVehicleId: number | null = null;

  service: any = {
    id: null,
    invoiceCode: '',
    startDate: null,
    endDate: '',
    currentMileage: '',
    vehicleDto: {
      model: ''
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
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { this.loadUsers(); this.loadVehicles()}

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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 0;
      this.pageSize = +params['pageSize'] || 5;
      this.getServices();
    });

    this.invoiceCodeControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.startDateControl.valueChanges
      .subscribe(() => this.onSearchChange());

    this.endDateControl.valueChanges
      .subscribe(() => this.onSearchChange());

    this.vehicleControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.userControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());
  }

  onSearchChange(): void {
    this.currentPage = 0;
    const selectedVehicle = this.vehicles.find(vehicle =>
      `${vehicle.manufacturer} ${vehicle.model}` === this.vehicleControl.value
    );
    this.selectedVehicleId = selectedVehicle ? selectedVehicle.id : null;
    
    this.currentPage = 0;
    this.getServices();
  }

  getServices(): void {
    const serviceFiltersQueryDto = {
      invoiceCode: this.invoiceCodeControl.value,
      startDate: this.startDateControl.value,
      endDate: this.endDateControl.value,
      vehicleId: this.selectedVehicleId,
      userId: this.userControl.value
    };
    console.log('Filters:', serviceFiltersQueryDto);
    this.http.post<any>(`${BASIC_URL}services/search?page=${this.currentPage}&pageSize=${this.pageSize}`,
      serviceFiltersQueryDto,
      {
        headers: this.authService.createAuthorizationHeader(),
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
    this.http.get<any[]>(`${BASIC_URL}users`, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => console.error('Error fetching users:', error)
    });
  }

  loadVehicles(): void {
    this.http.get<any[]>(`${BASIC_URL}vehicles`, {
      headers: this.authService.createAuthorizationHeader()
    }).subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (error) => console.error('Error fetching vehicles:', error)
    });
  }

}
