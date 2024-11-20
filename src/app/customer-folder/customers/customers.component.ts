import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, ReactiveFormsModule, SidebarComponent, MatSlideToggleModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  currentPage = 0;
  pageSize = 5;
  totalItems = 0;
  isDeleted = false;

  fullNameControl = new FormControl('');
  addressControl = new FormControl('');
  phoneNumberControl = new FormControl('');

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 0;
      this.pageSize = +params['pageSize'] || 5;
      this.getCustomers();
    });


    this.fullNameControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.addressControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.phoneNumberControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.getCustomers();
  }

  getCustomerById(id: number): void {
    this.router.navigate([`/customers`, id]);
  }

  getCustomers(): void {
    const customerFiltersQueryDto = {
      fullName: this.fullNameControl.value,
      address: this.addressControl.value,
      phoneNumber: this.phoneNumberControl.value,
      isDeleted: this.isDeleted
    };

    this.http.post<any>(`${BASIC_URL}customers/search?page=${this.currentPage}&pageSize=${this.pageSize}`,
      customerFiltersQueryDto,
      {
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

  onToggleChange(event: any): void {
    this.isDeleted = event.checked;
    this.currentPage = 0;
    this.getCustomers(); 
  }
}
