import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderCancelledComponent } from './admin-order-cancelled.component';

describe('AdminOrderCancelledComponent', () => {
  let component: AdminOrderCancelledComponent;
  let fixture: ComponentFixture<AdminOrderCancelledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrderCancelledComponent]
    });
    fixture = TestBed.createComponent(AdminOrderCancelledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
