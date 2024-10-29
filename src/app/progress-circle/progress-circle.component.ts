import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
  standalone: true
})
export class ProgressCircleComponent implements OnInit {
  @Input() maxValue = 100;          // Maximum value for the circle
  @Input() targetValue = 0;         // Target value to animate to
  @Input() strokeColor = '#A07855'; // Default color for the progress stroke

  currentValue = 0;                 // Current value to animate
  displayValue = 0;                 // Displayed value
  circumference: number;            // Circumference for circle calculations

  constructor() {
    const radius = 45;
    this.circumference = 2 * Math.PI * radius;
  }

  ngOnInit() {
    this.animateProgress(this.targetValue);
  }

  animateProgress(targetValue: number) {
    const animationDuration = 2000; // Animation duration in ms
    const frameRate = 30;           // Frames per second
    const increment = targetValue / (animationDuration / frameRate);

    const interval = setInterval(() => {
      if (this.currentValue < targetValue) {
        this.currentValue += increment;
        this.displayValue = Math.floor(this.currentValue);
      } else {
        this.currentValue = targetValue;
        this.displayValue = targetValue;
        clearInterval(interval);
      }
    }, 1000 / frameRate);
  }
}
