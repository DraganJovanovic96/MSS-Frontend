import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerVehicleDialogComponent } from './customer-vehicle-dialog.component';

describe('CustomerVehicleDialogComponent', () => {
  let component: CustomerVehicleDialogComponent;
  let fixture: ComponentFixture<CustomerVehicleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerVehicleDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerVehicleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
