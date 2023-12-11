import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShippingFeeComponent } from './admin-shipping-fee.component';

describe('AdminShippingFeeComponent', () => {
  let component: AdminShippingFeeComponent;
  let fixture: ComponentFixture<AdminShippingFeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminShippingFeeComponent]
    });
    fixture = TestBed.createComponent(AdminShippingFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
