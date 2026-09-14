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

  private serviceIdSource = new BehaviorSubject<number | null>(null);
  serviceId$ = this.serviceIdSource.asObservable();

  private serviceVehicleIdSource = new BehaviorSubject<number | null>(null);
  serviceVehicleId$ = this.serviceVehicleIdSource.asObservable();

  private customerReportServiceIdSource = new BehaviorSubject<number | null>(null);
  customerReportServiceId$ = this.customerReportServiceIdSource.asObservable();

  private serviceCustomerReportIdSource = new BehaviorSubject<number | null>(null);
  serviceCustomerReportId$ = this.serviceCustomerReportIdSource.asObservable();

  private customerReportDataSource = new BehaviorSubject<any | null>(null);
  customerReportData$ = this.customerReportDataSource.asObservable();

  private mobileSidebarOpenSource = new BehaviorSubject<boolean>(false);
  mobileSidebarOpen$ = this.mobileSidebarOpenSource.asObservable();

  setCustomerId(id: number) {
    this.customerIdSource.next(id);
  }

  setVehicleId(id: number) {
    this.vehicleIdSource.next(id);
  }

  setServiceId(id: number) {
    this.serviceIdSource.next(id);
  }

  setServiceVehicleId(id: number) {
    this.serviceVehicleIdSource.next(id);
  }

  setCustomerReportServiceId(id: number) {
    this.customerReportServiceIdSource.next(id);
  }

  setServiceCustomerReportId(id: number) {
    this.serviceCustomerReportIdSource.next(id);
  }

  setCustomerReportData(data: any) {
    this.customerReportDataSource.next(data);
  }

  getCustomerReportData() {
    return this.customerReportDataSource.value;
  }

  clearCustomerReportData() {
    this.customerReportDataSource.next(null);
  }

  getServiceVehicleId() {
    return this.serviceVehicleIdSource.value;
  }

  getCustomerReportServiceId() {
    return this.customerReportServiceIdSource.value;
  }

  getServiceCustomerReportId() {
    return this.serviceCustomerReportIdSource.value;
  }

  setMobileSidebarOpen(isOpen: boolean) {
    this.mobileSidebarOpenSource.next(isOpen);
  }

  getMobileSidebarOpen() {
    return this.mobileSidebarOpenSource.value;
  }
}
