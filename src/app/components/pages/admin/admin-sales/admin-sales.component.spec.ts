import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSalesComponent } from './admin-sales.component';

describe('AdminSalesComponent', () => {
  let component: AdminSalesComponent;
  let fixture: ComponentFixture<AdminSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
