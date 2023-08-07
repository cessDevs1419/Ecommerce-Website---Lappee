import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageTosComponent } from './admin-manage-tos.component';

describe('AdminManageTosComponent', () => {
  let component: AdminManageTosComponent;
  let fixture: ComponentFixture<AdminManageTosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageTosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManageTosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
