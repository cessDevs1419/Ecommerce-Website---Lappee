import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.css']
})
export class NotificationDropdownComponent {
  bg_dark: string = 'bg-notification-dark'
  font_dark: string = 'text-white'
  font_dark_subtle: string = 'text-notification-grey'
}
