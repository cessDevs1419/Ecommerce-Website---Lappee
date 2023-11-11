import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { OrderContent } from 'src/assets/models/order-details';
import { ToastComponent } from '../toast/toast.component';
import { CartItem } from 'src/assets/models/products';
import { ToasterComponent } from '../toaster/toaster/toaster.component';

@Component({
  selector: 'app-modal-client',
  templateUrl: './modal-client.component.html',
  styleUrls: ['./modal-client.component.css']
})
export class ModalClientComponent {

  @ViewChild('modal') modal: ElementRef;
  @Input() mode: string = "";
  @Input() params_target: string = "";
  @Input() context: string = "";
  @Input() operation: string = "";
  @Input() modalSize: string = "modal-lg"
  @Output() confirmDialogOutput = new EventEmitter<boolean>();
  modalTitle!: string;

  toastTheme!: string;
  toastHeader!: string;
  toastContent!: string;
  @ViewChild(ToasterComponent) toaster: ToasterComponent;

  modalEl: bootstrap.Modal;

  // review resources
  product!: any;

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

  // Confirm Dialog Methods

  confirmRemoveCartItem(item: CartItem){
    this.modalTitle = "Remove from Cart";
    this.operation = "delete";
    this.context = "cart";
    this.product = item;
    this.show()
  }

  passConfirmDialogOutput(params: any): void {
    this.confirmDialogOutput.emit(params);
  }

  // Edit Cart Item Methods
  editCartItem(item: CartItem): void {
    this.modalTitle = "Edit Cart Item";
    this.product = item;
    this.modalSize = 'modal-xl';
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
    this.toaster.showToast(data[0], data[1], data[2])
  }
 
}
