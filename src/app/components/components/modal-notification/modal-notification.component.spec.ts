import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNotificationComponent } from './modal-notification.component';

describe('ModalNotificationComponent', () => {
  let component: ModalNotificationComponent;
  let fixture: ComponentFixture<ModalNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNotificationComponent]
    });
    fixture = TestBed.createComponent(ModalNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
