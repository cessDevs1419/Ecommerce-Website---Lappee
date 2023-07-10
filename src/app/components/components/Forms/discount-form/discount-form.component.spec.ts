import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountFormComponent } from './discount-form.component';

describe('DiscountFormComponent', () => {
  let component: DiscountFormComponent;
  let fixture: ComponentFixture<DiscountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
