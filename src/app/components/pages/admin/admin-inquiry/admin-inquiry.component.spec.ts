import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInquiryComponent } from './admin-inquiry.component';

describe('AdminInquiryComponent', () => {
  let component: AdminInquiryComponent;
  let fixture: ComponentFixture<AdminInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
