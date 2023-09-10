import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubCategoriesComponent } from './admin-sub-categories.component';

describe('AdminSubCategoriesComponent', () => {
  let component: AdminSubCategoriesComponent;
  let fixture: ComponentFixture<AdminSubCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSubCategoriesComponent]
    });
    fixture = TestBed.createComponent(AdminSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
