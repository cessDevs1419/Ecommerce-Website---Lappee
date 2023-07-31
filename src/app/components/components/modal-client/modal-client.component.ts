import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { OrderContent } from 'src/assets/models/order-details';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-modal-client',
  templateUrl: './modal-client.component.html',
  styleUrls: ['./modal-client.component.css']
})
export class ModalClientComponent {

  @ViewChild('modal') modal: ElementRef;
  @Input() mode: string = "";
  modalTitle!: string;

  toastTheme!: string;
  toastHeader!: string;
  toastContent!: string;
  @ViewChild(ToastComponent) toast: ToastComponent;

  modalEl: bootstrap.Modal;

  // review resources
  product!: OrderContent;

  ngOnInit(): void {
    
   /*  switch (this.mode) {
      case "add-review":
        
        break;
    
      default:
        break;
    } */
  }

  ngAfterViewInit(): void {
    this.modalEl = new bootstrap.Modal(this.modal.nativeElement);
  }

  addReview(item: OrderContent): void {
    console.log(this.mode);
    console.log(this.modalTitle)
    this.modalTitle = "Add Review";
    this.product = item;
    this.show();
  }

  show(): void {
    this.modalEl.show();
  }

  dismiss(): void {
    console.log('dismiss from modal');
    this.modalEl.hide();
  }

  activateToast(data: string[]): void {
    this.toastHeader = data[0];
    this.toastContent = data[1];
    this.toast.switchTheme(data[2]);
    this.toast.show()
  }
 
}
