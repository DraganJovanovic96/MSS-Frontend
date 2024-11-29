import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-services-components',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './services-components.component.html',
  styleUrl: './services-components.component.scss'
})
export class ServicesComponentsComponent implements OnInit {
  services: any[] = [];
  serviceTypeDtos: any[] = [];
  users: any[] = [];
  vehicles: any[] = [];
  isDeleted = false;

  invoiceCodeControl = new FormControl('');
  startDateControl = new FormControl(null);
  endDateControl = new FormControl(null);
  vehicleControl = new FormControl(null);
  userControl = new FormControl(null);

  selectedVehicleId: number | null = null;
  selectedUserId: number | null = null;

  service: any = {
    id: null,
    invoiceCode: '',
    startDate: null,
    endDate: '',
    currentMileage: '',
    vehicleDto: {
      model: '',
      manufacturer: ''
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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedVehicleId = params.get('vehicleId') ? +params.get('vehicleId')! : null;
      this.selectedUserId = params.get('userId') ? +params.get('userId')! : null;
      this.currentPage = +this.route.snapshot.queryParamMap.get('page')! || 0;
      this.pageSize = +this.route.snapshot.queryParamMap.get('pageSize')! || 5;

      this.loadUsers();
      this.loadVehicles();
      this.getServices();
    });

    this.setupSearchControls();
  }

  setupSearchControls(): void {
    const controls = [
      this.invoiceCodeControl,
      this.startDateControl,
      this.endDateControl,
      this.vehicleControl,
      this.userControl
    ];

    controls.forEach(control => {
      control.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => this.onSearchChange());
    });
  }

  getServices(): void {
    const serviceFiltersQueryDto = {
      invoiceCode: this.invoiceCodeControl.value,
      startDate: this.startDateControl.value,
      endDate: this.endDateControl.value,
      vehicleId: this.selectedVehicleId !== null ? this.selectedVehicleId : undefined,
      userId: this.selectedUserId !== null ? this.selectedUserId : undefined,
      isDeleted: this.isDeleted
    };

    this.http.post<any>(`${BASIC_URL}services/search?page=${this.currentPage}&pageSize=${this.pageSize}`,
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

  getServiceById(id: number): void {
    this.router.navigate([`/services`, id]);
  }

  onToggleChange(event: any): void {
    this.isDeleted = event.checked;
    this.currentPage = 0;
    this.getServices(); 
  }
}
