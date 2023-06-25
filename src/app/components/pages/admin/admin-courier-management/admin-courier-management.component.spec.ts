import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCourierManagementComponent } from './admin-courier-management.component';

describe('AdminCourierManagementComponent', () => {
  let component: AdminCourierManagementComponent;
  let fixture: ComponentFixture<AdminCourierManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCourierManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCourierManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
