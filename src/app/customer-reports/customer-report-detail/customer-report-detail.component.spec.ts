import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomerReportDetailComponent } from './customer-report-detail.component';

describe('CustomerReportDetailComponent', () => {
  let component: CustomerReportDetailComponent;
  let fixture: ComponentFixture<CustomerReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CustomerReportDetailComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomerReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
