import { Component, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ProgressCircleComponent],
  standalone: true,
})
export class HomeComponent implements AfterViewInit {
  totalCustomers = 35;
  totalVehicles = 45;
  totalServices = 50;

  @ViewChildren(ProgressCircleComponent)
  progressCircles!: QueryList<ProgressCircleComponent>;

  constructor() {}

  ngAfterViewInit() {
    const delayIncrement = 1500; 
    this.progressCircles.forEach((circle, index) => {
      setTimeout(() => {
        circle.animateProgress(circle.targetValue);
      }, index *1/1.7 * delayIncrement);
    });
  }
}
