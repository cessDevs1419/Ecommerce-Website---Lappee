import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderDeliveredComponent } from './admin-order-delivered.component';

describe('AdminOrderDeliveredComponent', () => {
  let component: AdminOrderDeliveredComponent;
  let fixture: ComponentFixture<AdminOrderDeliveredComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrderDeliveredComponent]
    });
    fixture = TestBed.createComponent(AdminOrderDeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
