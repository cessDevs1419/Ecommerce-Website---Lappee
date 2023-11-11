import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderHoldComponent } from './admin-order-hold.component';

describe('AdminOrderHoldComponent', () => {
  let component: AdminOrderHoldComponent;
  let fixture: ComponentFixture<AdminOrderHoldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrderHoldComponent]
    });
    fixture = TestBed.createComponent(AdminOrderHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
