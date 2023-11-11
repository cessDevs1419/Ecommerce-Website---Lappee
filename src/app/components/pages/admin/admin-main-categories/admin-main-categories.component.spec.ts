import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainCategoriesComponent } from './admin-main-categories.component';

describe('AdminMainCategoriesComponent', () => {
  let component: AdminMainCategoriesComponent;
  let fixture: ComponentFixture<AdminMainCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMainCategoriesComponent]
    });
    fixture = TestBed.createComponent(AdminMainCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
