import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCustomerComponent } from './email-customer.component';

describe('EmailCustomerComponent', () => {
  let component: EmailCustomerComponent;
  let fixture: ComponentFixture<EmailCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
