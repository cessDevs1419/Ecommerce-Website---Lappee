import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {

  constructor(private router: Router){}

  // Set toast header
  @Input() toastTitle: string;
  @Input() toastClass: string;
  // Set toast message
  @Input() toastContent: string;

  // Set toast color theme
  // (default | positive | warn | negative)
  // default = primary color with check icon
  // positive = green color with check icon
  // warn = yellow color with triangle exclamation icon
  // red = red color with encircled exclamation icon
  @Input() toastTheme: string;
  @Input() routerLink: string = ""
  @Input() limitWidth: boolean = true

  theme: string;
  opacity: number = 0;
  accent: string;
  isVisible: boolean = true;

  ngOnInit(): void {
    console.log(this.limitWidth)
  }

  switchTheme(input: string): void {
    switch(input){
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

      case 'alert': {
        this.theme = "bi-exclamation-circle-fill text-success";
        this.accent = "bg-success";
        break;
      }

      case 'unattended': {
        this.theme = "bi-question-circle-fill text-warning";
        this.accent = "bg-warning";
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
    console.log("Before switch: " + this.theme);
    //this.switchTheme();
    console.log("After switch: " + this.theme);
    this.opacity = 100;
  }

  hide(): void {
    this.opacity = 0;
  }

  navigate(): void {
    console.log(this.routerLink);
    if(this.routerLink){
      this.router.navigateByUrl(this.routerLink);
    }
  }
}
