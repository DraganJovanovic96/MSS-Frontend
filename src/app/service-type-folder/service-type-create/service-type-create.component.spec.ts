import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeCreateComponent } from './service-type-create.component';

describe('ServiceTypeCreateComponent', () => {
  let component: ServiceTypeCreateComponent;
  let fixture: ComponentFixture<ServiceTypeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTypeCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
