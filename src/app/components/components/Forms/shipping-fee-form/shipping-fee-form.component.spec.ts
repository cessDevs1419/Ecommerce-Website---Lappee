import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingFeeFormComponent } from './shipping-fee-form.component';

describe('ShippingFeeFormComponent', () => {
  let component: ShippingFeeFormComponent;
  let fixture: ComponentFixture<ShippingFeeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingFeeFormComponent]
    });
    fixture = TestBed.createComponent(ShippingFeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
