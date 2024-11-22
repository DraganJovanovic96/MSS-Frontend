import { Component, ViewChildren, QueryList, AfterViewInit, OnInit } from '@angular/core';
import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';
import { DashboardService } from '../services/dashboard';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ProgressCircleComponent],
  standalone: true,
})
export class HomeComponent implements OnInit, AfterViewInit {
  totalCustomers = 0;
  totalVehicles = 0;
  totalServices = 0;

  @ViewChildren(ProgressCircleComponent)
  progressCircles!: QueryList<ProgressCircleComponent>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getCounts().subscribe({
      next: (data) => {
        this.totalCustomers = data.customers;
        this.totalVehicles = data.vehicles;
        this.totalServices = data.services;

        // Ensure animations are triggered after data is loaded
        this.triggerAnimations();
      },
      error: (err) => {
        console.error('Error fetching counts:', err);
      },
    });
  }

  ngAfterViewInit() {
    // ViewChildren are initialized here but we wait for data before triggering animations
  }

  private triggerAnimations() {
    const delayIncrement = 1500; // Adjust delay as needed
    if (this.progressCircles) {
      this.progressCircles.forEach((circle, index) => {
        setTimeout(() => {
          circle.animateProgress(circle.targetValue);
        }, index * 1/1.7 * delayIncrement);
      });
    }
  }
}
