import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
export interface ThemeModel{
  theme: string,
  title: string,
  subTitle: string,
  link: string
}

@Component({
  selector: 'app-modal-notification',
  templateUrl: './modal-notification.component.html',
  styleUrls: ['./modal-notification.component.css']
})


export class ModalNotificationComponent {
  @ViewChild('modal') modal: ElementRef;
  @Input() modalClass: string;
  // @Output() isVisible: EventEmitter<any> = new EventEmitter();

  

  theme: string;
  accent: string;
  isVisible: boolean = false
  title: string;
  subTitle: string;
  link: string;
  constructor(private modalService: BsModalService,
    public bsModalRef: BsModalRef,
    private router: Router
    ) {

  }
  showModal(theme: ThemeModel): void {
    this.show();
  
    this.bsModalRef.content.switchTheme(theme.theme);
    this.bsModalRef.content.title = theme.title;
    this.bsModalRef.content.subTitle = theme.subTitle;
    this.bsModalRef.content.link = theme.link
    this.bsModalRef.content.isVisible = true
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
    this.bsModalRef = this.modalService.show(ModalNotificationComponent, {
      class: 'modal-dialog-centered',
      backdrop: 'static'
    });
    
  }

  hide(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
      // this.isVisible.emit()
      this.isVisible = false
    }
  }

  route(link: string): void{
    this.router.navigateByUrl(link)
    this.hide()

  }


}
