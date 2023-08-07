import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageAboutUsComponent } from './admin-manage-about-us.component';

describe('AdminManageAboutUsComponent', () => {
  let component: AdminManageAboutUsComponent;
  let fixture: ComponentFixture<AdminManageAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageAboutUsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManageAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
