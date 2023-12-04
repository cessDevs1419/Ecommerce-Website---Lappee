import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHoldDenyReasonsComponent } from './admin-hold-deny-reasons.component';

describe('AdminHoldDenyReasonsComponent', () => {
  let component: AdminHoldDenyReasonsComponent;
  let fixture: ComponentFixture<AdminHoldDenyReasonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminHoldDenyReasonsComponent]
    });
    fixture = TestBed.createComponent(AdminHoldDenyReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
