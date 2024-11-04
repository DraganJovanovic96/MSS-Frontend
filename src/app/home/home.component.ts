import { Component } from '@angular/core';
import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ProgressCircleComponent],
  standalone: true,
})
export class HomeComponent {
  totalCustomers = 35;
  totalVehicles = 45;
  totalServices = 50;

  constructor() { }
}
