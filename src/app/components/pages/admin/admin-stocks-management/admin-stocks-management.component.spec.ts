import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStocksManagementComponent } from './admin-stocks-management.component';

describe('AdminStocksManagementComponent', () => {
  let component: AdminStocksManagementComponent;
  let fixture: ComponentFixture<AdminStocksManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminStocksManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStocksManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
