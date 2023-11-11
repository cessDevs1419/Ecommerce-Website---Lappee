import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderShippingComponent } from './admin-order-shipping.component';

describe('AdminOrderShippingComponent', () => {
  let component: AdminOrderShippingComponent;
  let fixture: ComponentFixture<AdminOrderShippingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrderShippingComponent]
    });
    fixture = TestBed.createComponent(AdminOrderShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
