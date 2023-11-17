import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupReminderComponent } from './setup-reminder.component';

describe('SetupReminderComponent', () => {
  let component: SetupReminderComponent;
  let fixture: ComponentFixture<SetupReminderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetupReminderComponent]
    });
    fixture = TestBed.createComponent(SetupReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
