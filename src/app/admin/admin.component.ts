import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatSlideToggleModule, SidebarComponent, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  @ViewChild('userListContainer') userListContainer!: ElementRef;
  users: any[] = [];
  currentPage = 0;
  pageSize = 5;
  totalItems = 0;
  isDeleted = false;

  fullNameControl = new FormControl('');
  emailControl = new FormControl('');
  addressControl = new FormControl('');
  phoneNumberControl = new FormControl('');

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 0;
      this.pageSize = +params['pageSize'] || 5;
      this.getUsers();
    });

    this.fullNameControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.addressControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.emailControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());

    this.phoneNumberControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearchChange());
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.getUsers();
  }

  getUsersById(id: number): void {
    this.router.navigate([`/users`, id]);
  }

  getUsers(): void {
    const userFiltersQueryDto = {
      fullName: this.fullNameControl.value,
      address: this.addressControl.value,
      email: this.emailControl.value,
      phoneNumber: this.phoneNumberControl.value,
      isDeleted: this.isDeleted,
    };

    this.http
      .post<any>(`${BASIC_URL}users/search?page=${this.currentPage}&pageSize=${this.pageSize}`, userFiltersQueryDto, {
        observe: 'response',
      })
      .subscribe({
        next: (response) => {
          this.users = response.body;
          this.totalItems = parseInt(response.headers.get('x-total-items') || '0', 10);
        },
        error: (error) => console.error('Error fetching users:', error),
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, pageSize: this.pageSize },
      queryParamsHandling: 'merge',
    });
  }

  onToggleChange(event: any): void {
    this.isDeleted = event.checked;
    this.currentPage = 0;
    this.getUsers();
  }
}
