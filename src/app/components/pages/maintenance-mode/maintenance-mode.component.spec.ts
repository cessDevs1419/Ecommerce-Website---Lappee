import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceModeComponent } from './maintenance-mode.component';

describe('MaintenanceModeComponent', () => {
  let component: MaintenanceModeComponent;
  let fixture: ComponentFixture<MaintenanceModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceModeComponent]
    });
    fixture = TestBed.createComponent(MaintenanceModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
