import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedDataService } from '../../services/SharedDataService';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterModule, CommonModule]
})
export class SidebarComponent implements OnInit, OnDestroy {
  customerId: number | null = null;
  vehicleId: number | null = null;
  serviceId: number | null = null;

  private customerIdSub!: Subscription;
  private vehicleIdSub!: Subscription;
  private serviceIdSub!: Subscription;

  constructor(private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    this.customerIdSub = this.sharedDataService.customerId$.subscribe(id => {
      this.customerId = id;
    });

    this.vehicleIdSub = this.sharedDataService.vehicleId$.subscribe(id => {
      this.vehicleId = id;
    });

    this.serviceIdSub = this.sharedDataService.serviceId$.subscribe(id => {
      this.serviceId = id;
    });
  }

  ngOnDestroy(): void {
    this.customerIdSub.unsubscribe();
    this.vehicleIdSub.unsubscribe();
    this.serviceIdSub.unsubscribe();
  }
}
