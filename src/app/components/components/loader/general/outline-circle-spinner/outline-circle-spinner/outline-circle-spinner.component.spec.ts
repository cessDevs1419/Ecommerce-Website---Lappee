import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlineCircleSpinnerComponent } from './outline-circle-spinner.component';

describe('OutlineCircleSpinnerComponent', () => {
  let component: OutlineCircleSpinnerComponent;
  let fixture: ComponentFixture<OutlineCircleSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutlineCircleSpinnerComponent]
    });
    fixture = TestBed.createComponent(OutlineCircleSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
