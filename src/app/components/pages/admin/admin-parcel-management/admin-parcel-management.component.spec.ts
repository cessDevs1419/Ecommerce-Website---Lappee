import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminParcelManagementComponent } from './admin-parcel-management.component';

describe('AdminParcelManagementComponent', () => {
  let component: AdminParcelManagementComponent;
  let fixture: ComponentFixture<AdminParcelManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminParcelManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminParcelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
