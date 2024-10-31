import { Component } from '@angular/core';
import { ProgressCircleComponent } from '../progress-circle/progress-circle.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ProgressCircleComponent], // Add this line
  standalone: true,
})
export class HomeComponent {
  totalCustomers = 35; // Number of happy customers
  totalVehicles = 45;
  totalServices = 50; // Number of vehicles served

  constructor() { }
}
