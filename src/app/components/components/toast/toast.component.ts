import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  // Set toast header
  @Input() toastTitle: string;

  // Set toast message
  @Input() toastContent: string;

  // Set toast color theme
  // (default | positive | warn | negative)
  // default = primary color with check icon
  // positive = green color with check icon
  // warn = yellow color with triangle exclamation icon
  // red = red color with encircled exclamation icon
  @Input() toastTheme: string;

  theme: string;
  opacity: number = 0;
  accent: string;
  isVisible: boolean = true;

  ngOnInit(): void {
    switch(this.toastTheme){
      case 'default': {
        this.theme = "bi-check-circle-fill color-primary";
        this.accent = "bg-primary";
        break;
      }
      case 'positive': {
        this.theme = "bi-check-circle-fill text-success";
        this.accent = "bg-success";
        break;
      }
      case 'warn': {
        this.theme = "bi-exclamation-triangle-fill text-warning"
        this.accent = "bg-warning";
        break;
      }

      case 'negative': {
        this.theme = "bi-exclamation-diamond-fill text-danger";
        this.accent = "bg-danger";
        break;
      }
      default: {
        this.theme = "bi-check-circle-fill color-primary";
        this.accent = "bg-primary";
        break;
      }
    }
  }

  show(): void {
    this.opacity = 100;
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide(): void {
    this.opacity = 0;
  }
}
