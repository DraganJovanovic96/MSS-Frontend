import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private customerIdSource = new BehaviorSubject<number | null>(null);
  customerId$ = this.customerIdSource.asObservable();

  private vehicleIdSource = new BehaviorSubject<number | null>(null);
  vehicleId$ = this.vehicleIdSource.asObservable();

  setCustomerId(id: number) {
    this.customerIdSource.next(id);
  }

  setVehicleId(id: number) {
    this.vehicleIdSource.next(id);
  }
}
