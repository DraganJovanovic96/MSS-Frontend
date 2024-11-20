import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-service-types',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgSelectModule,
    FormsModule, CommonModule, RouterModule, MatSlideToggleModule],
  templateUrl: './service-types.component.html',
  styleUrl: './service-types.component.scss'
})
export class ServiceTypesComponent implements OnInit {

  isDropdownFocused = false;
  currentPage = 0;
  pageSize = 5;
  totalItems = 0;
  isDeleted = false;
  serviceTypes: any[] = [];
  services: any[] = [];

  typeOfServiceControl = new FormControl('');
  descriptionControl = new FormControl('');
  priceMinControl = new FormControl('');
  priceMaxControl = new FormControl('');
  serviceControl = new FormControl(null);

  selectedServiceId: number | null = null;

  serviceType: any = {
    typeOfService: '',
    description: '',
    price: 0,
    priceMin: '',
    priceMax: '',
    serviceDto: {
      id: '',
      invoiceCode: ''
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  getServiceTypeById(id: number): void {
    this.router.navigate([`/service-types`, id]);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedServiceId = params.get('serviceId') ? +params.get('serviceId')! : null;
      this.currentPage = +this.route.snapshot.queryParamMap.get('page')! || 0;
      this.pageSize = +this.route.snapshot.queryParamMap.get('pageSize')! || 5;

      this.getServiceTypes();
      this.loadServices()
    });

    this.setupSearchControls();
  }

  setupSearchControls(): void {
    const controls = [
      this.typeOfServiceControl,
      this.descriptionControl,
      this.priceMinControl,
      this.priceMaxControl,
      this.serviceControl
    ];

    controls.forEach(control => {
      control.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => this.onSearchChange());
    });
  }


  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, pageSize: this.pageSize },
      queryParamsHandling: 'merge'
    });

    this.getServiceTypes();
  }

  getServiceTypes(): void {
    const serviceTypeFiltersQueryDto = {
      typeOfService: this.typeOfServiceControl.value,
      description: this.descriptionControl.value,
      priceMin: this.priceMinControl.value,
      priceMax: this.priceMaxControl.value,
      serviceId: this.selectedServiceId !== null ? this.selectedServiceId : undefined,
      isDeleted: this.isDeleted
    };

    this.http.post<any>(`${BASIC_URL}service-types/search?page=${this.currentPage}&pageSize=${this.pageSize}`,
      serviceTypeFiltersQueryDto,
      {
        observe: 'response'
      }
    ).subscribe({
      next: (response: HttpResponse<any>) => {
        this.serviceTypes = response.body;
        this.totalItems = parseInt(response.headers.get('x-total-items') || '0', 10);
      },
      error: (error) => console.error('Error fetching service types:', error)
    });
  }

  loadServices(): void {
    this.http.get<any[]>(`${BASIC_URL}services`).subscribe({
      next: (data) => {
        this.services = data.map(service => ({
          ...service
        }));
        console.log(this.services); 
      },
      error: (error) => console.error('Error fetching services:', error)
    });
  }

  onServiceInputChange(event: any): void {
    const inputValue = this.serviceControl.value;

    const parsedId = inputValue ? parseInt(inputValue, 10) : null;

    if (parsedId !== null && !isNaN(parsedId)) {
      this.selectedServiceId = parsedId;
    } else {
      this.selectedServiceId = null;
    }

    this.onSearchChange();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.getServiceTypes();
  }

  onToggleChange(event: any): void {
    this.isDeleted = event.checked;
    this.currentPage = 0;
    this.getServiceTypes(); 
  }
}
