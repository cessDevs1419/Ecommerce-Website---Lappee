import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountsUsersComponent } from './admin-accounts-users.component';

describe('AdminAccountsUsersComponent', () => {
  let component: AdminAccountsUsersComponent;
  let fixture: ComponentFixture<AdminAccountsUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAccountsUsersComponent]
    });
    fixture = TestBed.createComponent(AdminAccountsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
