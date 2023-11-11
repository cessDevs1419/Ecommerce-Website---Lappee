import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderPackComponent } from './admin-order-pack.component';

describe('AdminOrderPackComponent', () => {
  let component: AdminOrderPackComponent;
  let fixture: ComponentFixture<AdminOrderPackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrderPackComponent]
    });
    fixture = TestBed.createComponent(AdminOrderPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
