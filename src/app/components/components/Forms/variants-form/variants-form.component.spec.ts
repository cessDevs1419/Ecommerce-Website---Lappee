import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantsFormComponent } from './variants-form.component';

describe('VariantsFormComponent', () => {
  let component: VariantsFormComponent;
  let fixture: ComponentFixture<VariantsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariantsFormComponent]
    });
    fixture = TestBed.createComponent(VariantsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
