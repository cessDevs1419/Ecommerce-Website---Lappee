import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnOrderComponent } from './return-order.component';

describe('ReturnOrderComponent', () => {
  let component: ReturnOrderComponent;
  let fixture: ComponentFixture<ReturnOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnOrderComponent]
    });
    fixture = TestBed.createComponent(ReturnOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
