import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductGroupComponent } from './admin-product-group.component';

describe('AdminProductGroupComponent', () => {
  let component: AdminProductGroupComponent;
  let fixture: ComponentFixture<AdminProductGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProductGroupComponent]
    });
    fixture = TestBed.createComponent(AdminProductGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
