import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantAttributesComponent } from './variant-attributes.component';

describe('VariantAttributesComponent', () => {
  let component: VariantAttributesComponent;
  let fixture: ComponentFixture<VariantAttributesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariantAttributesComponent]
    });
    fixture = TestBed.createComponent(VariantAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
