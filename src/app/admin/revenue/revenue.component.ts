import { Component, ViewChildren, QueryList, AfterViewInit, OnInit } from '@angular/core';
import { ProgressCircleComponent } from '../../progress-circle/progress-circle.component';
import { RevenueService } from '../../services/revenue';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts'; 
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-home',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss'],
  standalone: true,
  imports: [
    ProgressCircleComponent,
    MatPaginatorModule,
    CommonModule,
    NgxChartsModule  
  ],
})
export class RevenueComponent implements OnInit, AfterViewInit {
  totalServices = 0;
  totalRevenue = 0;
  totalParts = 0;

  services: any[] = [];
  serviceTypeDtos: any[] = [];
  users: any[] = [];
  vehicles: any[] = [];
  isDeleted = false;
  timeValue = 1;

  service: any = {
    id: null,
    invoiceCode: '',
    startDate: null,
    endDate: '',
    revenuePerService: 0,
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
  activeFilter: string = 'monthly';

  pieChartData: any[] = [];
  pieChartMechanicData: any[] = [];
  pieChartCustomerData: any[] = [];
  pieChartView: [number, number] = [200, 200];
  pieChartOptions: any = {
    showLabels: true,
    explodeSlices: true,
    doughnut: true,
    labels: false,
  };

  @ViewChildren(ProgressCircleComponent)
  progressCircles!: QueryList<ProgressCircleComponent>;

  constructor(
    private revenueService: RevenueService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) { }

  startDate = '';
  endDate = '';

  ngOnInit() {
    const currentDate = new Date();

    const oneMonthBefore = new Date(currentDate);
    oneMonthBefore.setMonth(currentDate.getMonth() - 1);

    this.startDate = oneMonthBefore.toISOString().split('T')[0];
    this.endDate = currentDate.toISOString().split('T')[0];

    this.revenueService.getCounts(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.totalRevenue = data.revenue;
        this.totalParts = data.parts;
        this.triggerAnimations();
      },
      error: (err) => {
        console.error('Error fetching counts:', err);
      },
    });

    this.pageSize = +this.route.snapshot.queryParamMap.get('pageSize')! || 5;

    this.fetchPieChartData();
    this.fetchPieChartMechanicData();
    this.fetchPieChartCustomerData();
    this.getServices();
  }

  ngAfterViewInit() {}

  private triggerAnimations() {
    const delayIncrement = 1500;
    if (this.progressCircles) {
      this.progressCircles.forEach((circle, index) => {
        setTimeout(() => {
          circle.animateProgress(circle.targetValue);
        }, index * 1 / 1.7 * delayIncrement);
      });
    }
  }
  
  private triggerImmediateAnimations() {
    if (this.progressCircles) {
      this.progressCircles.forEach((circle, index) => {
        setTimeout(() => {
          circle.animateProgress(circle.targetValue);
        }, index);
      });
    }
  }

  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
  
    switch (filter) {
      case 'monthly':
        this.filterDataMonth();
        break;
      case 'quarterly':
        this.filterDataQuarter();
        break;
      case 'half-yearly':
        this.filterDataHalfYear();
        break;
      case 'yearly':
        this.filterDataYearly();
        break;
      default:
        console.error('Unknown filter:', filter);
    }
  }

  fetchPieChartData(): void {
    const payload = {
      startDate: this.startDate,
      endDate: this.endDate,
    };

    this.http.post<any[]>(`${BASIC_URL}pie/revenue-by-service`, payload)
      .subscribe({
        next: (data) => {
          this.pieChartData = data.map(item => ({
            name: item.invoiceCode, 
            value: item.revenue,   
          }));
        },
        error: (error) => console.error('Error fetching pie chart data:', error)
      });
  }

  fetchPieChartMechanicData(): void {
    const payload = {
      startDate: this.startDate,
      endDate: this.endDate,
    };

    this.http.post<any[]>(`${BASIC_URL}pie/revenue-by-mechanic`, payload)
      .subscribe({
        next: (data) => {
          this.pieChartMechanicData = data.map(item => ({
            name: item.mechanicName, 
            value: item.revenue,   
          }));
        },
        error: (error) => console.error('Error fetching pie chart data:', error)
      });
  }

  fetchPieChartCustomerData(): void {
    const payload = {
      startDate: this.startDate,
      endDate: this.endDate,
    };

    this.http.post<any[]>(`${BASIC_URL}pie/revenue-by-customer`, payload)
      .subscribe({
        next: (data) => {
          this.pieChartCustomerData = data.map(item => ({
            name: item.customerName, 
            value: item.revenue,   
          }));
        },
        error: (error) => console.error('Error fetching pie chart data:', error)
      });
  }

  filterDataMonth(): void {
    const currentDate = new Date();
    const oneMonthBefore = new Date(currentDate);
    oneMonthBefore.setMonth(currentDate.getMonth() - 1);
  
    this.startDate = oneMonthBefore.toISOString().split('T')[0];
    this.endDate = currentDate.toISOString().split('T')[0];
  
    this.fetchDataForSelectedRange();
  }
  
  filterDataQuarter(): void {
    const currentDate = new Date();
    const threeMonthsBefore = new Date(currentDate);
    threeMonthsBefore.setMonth(currentDate.getMonth() - 3);
  
    this.startDate = threeMonthsBefore.toISOString().split('T')[0];
    this.endDate = currentDate.toISOString().split('T')[0];
  
    this.fetchDataForSelectedRange();
  }
  
  filterDataHalfYear(): void {
    const currentDate = new Date();
    const sixMonthsBefore = new Date(currentDate);
    sixMonthsBefore.setMonth(currentDate.getMonth() - 6);
  
    this.startDate = sixMonthsBefore.toISOString().split('T')[0];
    this.endDate = currentDate.toISOString().split('T')[0];
  
    this.fetchDataForSelectedRange();
  }
  
  filterDataYearly(): void {
    const currentDate = new Date();
    const oneYearBefore = new Date(currentDate);
    oneYearBefore.setFullYear(currentDate.getFullYear() - 1);
  
    this.startDate = oneYearBefore.toISOString().split('T')[0];
    this.endDate = currentDate.toISOString().split('T')[0];
  
    this.fetchDataForSelectedRange();
  }

  fetchDataForSelectedRange(): void {
    this.getServices();
    this.fetchPieChartData();
    this.fetchPieChartMechanicData();
    this.fetchPieChartCustomerData();
  
    this.totalServices = 0;
    this.totalRevenue = 0;
    this.totalParts = 0;
  
    setTimeout(() => {
      this.revenueService.getCounts(this.startDate, this.endDate).subscribe({
        next: (data) => {
          this.totalRevenue = data.revenue;
          this.totalParts = data.parts;
          this.totalServices = this.totalItems; 
          this.triggerImmediateAnimations(); 
        },
        error: (err) => {
          console.error('Error fetching counts:', err);
        },
      });
    }, ); 
  }
  getServices(): void {
    const serviceFiltersQueryDto = {
      startDate: this.startDate,
      startDateEnd: this.endDate,
      isDeleted: false
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
        this.totalServices = this.totalItems;
      },
      error: (error) => console.error('Error fetching services:', error)
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

    this.getServices();
  }

  getServiceById(id: number): void {
    this.router.navigate([`/services`, id]);
  }
}
