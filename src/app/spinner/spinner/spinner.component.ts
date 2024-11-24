import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  @Input() imageUrl: string = 'assets/images/mss-logo-black-png.png';
  @Input() altText: string = 'Loading...';
}
