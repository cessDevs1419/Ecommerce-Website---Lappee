import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChatComponent } from './admin-chat.component';

describe('AdminChatComponent', () => {
  let component: AdminChatComponent;
  let fixture: ComponentFixture<AdminChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminChatComponent]
    });
    fixture = TestBed.createComponent(AdminChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
