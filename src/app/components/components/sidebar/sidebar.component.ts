import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isClassToggled: boolean = false;

  toggleClass() {
    this.isClassToggled = !this.isClassToggled;
  }
}
