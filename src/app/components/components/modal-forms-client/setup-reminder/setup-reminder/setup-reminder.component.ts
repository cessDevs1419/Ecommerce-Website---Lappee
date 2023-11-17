import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-setup-reminder',
  templateUrl: './setup-reminder.component.html',
  styleUrls: ['./setup-reminder.component.css']
})
export class SetupReminderComponent {

  @Output() dismiss = new EventEmitter<any>();

  dismissModal(): void {
    this.dismiss.emit()
  }
}
