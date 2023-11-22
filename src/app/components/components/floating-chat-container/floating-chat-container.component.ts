import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-floating-chat-container',
  templateUrl: './floating-chat-container.component.html',
  styleUrls: ['./floating-chat-container.component.css']
})
export class FloatingChatContainerComponent {
  @ViewChild('closeDropdown') closeDropdown: ElementRef
  @Input() class: string = ''

  close(){
    this.closeDropdown.nativeElement.click()
  }
}
