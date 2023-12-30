import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountsCustomersComponent } from './admin-accounts-customers.component';

describe('AdminAccountsCustomersComponent', () => {
  let component: AdminAccountsCustomersComponent;
  let fixture: ComponentFixture<AdminAccountsCustomersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAccountsCustomersComponent]
    });
    fixture = TestBed.createComponent(AdminAccountsCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
