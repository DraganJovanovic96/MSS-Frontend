import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
  standalone: true
})
export class ProgressCircleComponent implements OnInit {
  @Input() maxValue = 100;         
  @Input() targetValue = 0;        
  @Input() strokeColor = '#A07855'; 

  currentValue = 0;                 
  displayValue = 0;                 
  circumference: number;            

  constructor() {
    const radius = 45;
    this.circumference = 2 * Math.PI * radius;
  }

  ngOnInit() {
    this.animateProgress(this.targetValue);
  }

  animateProgress(targetValue: number) {
    const animationDuration = 2000; 
    const frameRate = 30;           
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
