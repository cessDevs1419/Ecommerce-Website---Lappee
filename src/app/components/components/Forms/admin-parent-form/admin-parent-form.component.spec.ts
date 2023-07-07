import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminParentFormComponent } from './admin-parent-form.component';

describe('AdminParentFormComponent', () => {
  let component: AdminParentFormComponent;
  let fixture: ComponentFixture<AdminParentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminParentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminParentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
