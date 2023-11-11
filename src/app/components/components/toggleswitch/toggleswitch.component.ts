import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toggleswitch',
  templateUrl: './toggleswitch.component.html',
  styleUrls: ['./toggleswitch.component.css']
})
export class ToggleswitchComponent {
  isCheckboxChecked: boolean = false;
  @Output() isTrue: EventEmitter<any> = new EventEmitter();
  
  onCheckboxChange() {
    this.isTrue.emit(this.isCheckboxChecked)
  }
}
