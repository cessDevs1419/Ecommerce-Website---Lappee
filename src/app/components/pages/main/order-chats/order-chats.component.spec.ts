import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderChatsComponent } from './order-chats.component';

describe('OrderChatsComponent', () => {
  let component: OrderChatsComponent;
  let fixture: ComponentFixture<OrderChatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderChatsComponent]
    });
    fixture = TestBed.createComponent(OrderChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
