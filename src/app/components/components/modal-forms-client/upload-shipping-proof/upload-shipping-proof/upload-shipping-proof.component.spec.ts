import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadShippingProofComponent } from './upload-shipping-proof.component';

describe('UploadShippingProofComponent', () => {
  let component: UploadShippingProofComponent;
  let fixture: ComponentFixture<UploadShippingProofComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadShippingProofComponent]
    });
    fixture = TestBed.createComponent(UploadShippingProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
