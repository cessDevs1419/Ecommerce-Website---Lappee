import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { OrderContent } from 'src/assets/models/order-details';
import { ToastComponent } from '../toast/toast.component';
import { CartItem } from 'src/assets/models/products';

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
  @Output() confirmDialogOutput = new EventEmitter<boolean>();
  modalTitle!: string;

  toastTheme!: string;
  toastHeader!: string;
  toastContent!: string;
  @ViewChild(ToastComponent) toast: ToastComponent;

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
