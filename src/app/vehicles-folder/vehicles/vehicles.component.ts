import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MatPaginatorModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  currentPage = 0;
  pageSize = 5;
  totalItems = 0;
  vehicles: any[] = [];

  vehicle: any = {
    id: null,
    manufacturer: '',
    model: '',
    vehiclePlate: '',
    vin: '',
    yearOfManufacture: null,
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
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 0;
      this.pageSize = +params['pageSize'] || 5;
      this.getVehicles();
    });
  }

  getVehicles(): void {
    const vehicleFiltersQueryDto = {};
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
