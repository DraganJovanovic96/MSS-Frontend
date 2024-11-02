import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/SharedDataService';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterModule, CommonModule]  
})
export class SidebarComponent implements OnInit {
  customerId: number | null = null;
  vehicleId: number | null = null;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.sharedDataService.customerId$.subscribe(id => {
      this.customerId = id;
    });

    this.sharedDataService.vehicleId$.subscribe(id => {
      this.vehicleId = id; 
    });
  }
}
