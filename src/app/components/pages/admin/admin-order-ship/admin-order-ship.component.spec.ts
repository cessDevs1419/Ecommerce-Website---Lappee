import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderShipComponent } from './admin-order-ship.component';

describe('AdminOrderShipComponent', () => {
  let component: AdminOrderShipComponent;
  let fixture: ComponentFixture<AdminOrderShipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrderShipComponent]
    });
    fixture = TestBed.createComponent(AdminOrderShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
