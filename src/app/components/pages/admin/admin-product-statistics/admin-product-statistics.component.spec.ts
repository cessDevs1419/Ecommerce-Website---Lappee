import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductStatisticsComponent } from './admin-product-statistics.component';

describe('AdminProductStatisticsComponent', () => {
  let component: AdminProductStatisticsComponent;
  let fixture: ComponentFixture<AdminProductStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProductStatisticsComponent]
    });
    fixture = TestBed.createComponent(AdminProductStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
