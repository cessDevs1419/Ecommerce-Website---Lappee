import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSiteSettingsComponent } from './admin-site-settings.component';

describe('AdminSiteSettingsComponent', () => {
  let component: AdminSiteSettingsComponent;
  let fixture: ComponentFixture<AdminSiteSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSiteSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSiteSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
