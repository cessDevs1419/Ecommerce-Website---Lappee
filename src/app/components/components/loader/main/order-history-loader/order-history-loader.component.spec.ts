import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryLoaderComponent } from './order-history-loader.component';

describe('OrderHistoryLoaderComponent', () => {
  let component: OrderHistoryLoaderComponent;
  let fixture: ComponentFixture<OrderHistoryLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderHistoryLoaderComponent]
    });
    fixture = TestBed.createComponent(OrderHistoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
