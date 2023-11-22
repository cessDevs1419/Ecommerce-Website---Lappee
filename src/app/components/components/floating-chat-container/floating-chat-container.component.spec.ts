import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingChatContainerComponent } from './floating-chat-container.component';

describe('FloatingChatContainerComponent', () => {
  let component: FloatingChatContainerComponent;
  let fixture: ComponentFixture<FloatingChatContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloatingChatContainerComponent]
    });
    fixture = TestBed.createComponent(FloatingChatContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
