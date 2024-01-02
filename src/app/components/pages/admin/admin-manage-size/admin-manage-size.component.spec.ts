import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageSizeComponent } from './admin-manage-size.component';

describe('AdminManageSizeComponent', () => {
  let component: AdminManageSizeComponent;
  let fixture: ComponentFixture<AdminManageSizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminManageSizeComponent]
    });
    fixture = TestBed.createComponent(AdminManageSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
