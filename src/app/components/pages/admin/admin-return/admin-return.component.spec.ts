import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReturnComponent } from './admin-return.component';

describe('AdminReturnComponent', () => {
  let component: AdminReturnComponent;
  let fixture: ComponentFixture<AdminReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminReturnComponent]
    });
    fixture = TestBed.createComponent(AdminReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
