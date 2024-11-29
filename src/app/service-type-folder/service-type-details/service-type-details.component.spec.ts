import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeDetailsComponent } from './service-type-details.component';

describe('ServiceTypeDetailsComponent', () => {
  let component: ServiceTypeDetailsComponent;
  let fixture: ComponentFixture<ServiceTypeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTypeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
