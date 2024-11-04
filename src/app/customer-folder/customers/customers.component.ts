import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule,SidebarComponent],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  currentPage = 0;
  pageSize = 5;
  totalItems = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 0;
      this.pageSize = +params['pageSize'] || 5;
      this.getCustomers();
    });
  }

  getCustomerById(id: number): void {
    this.router.navigate([`/customers`, id]);
  }

  getCustomers(): void {
    const customerFiltersQueryDto = {};
    this.http.post<any>(`${BASIC_URL}customers/search?page=${this.currentPage}&pageSize=${this.pageSize}`,
      customerFiltersQueryDto,
      {
        headers: this.authService.createAuthorizationHeader(),
        observe: 'response'
      }
    ).subscribe({
      next: (response: HttpResponse<any>) => {
        this.customers = response.body;
        this.totalItems = parseInt(response.headers.get('x-total-items') || '0', 10);
      },
      error: (error) => console.error('Error fetching customers:', error)
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

    this.getCustomers();
  }
}
