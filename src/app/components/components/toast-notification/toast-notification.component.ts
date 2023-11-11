import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.css']
})
export class ToastNotificationComponent {
  @ViewChild('') date: ElementRef;

  @Input() data: Observable<any>;
  
  showToast(){
  
  }
}
