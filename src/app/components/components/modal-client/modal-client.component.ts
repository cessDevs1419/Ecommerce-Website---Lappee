import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { OrderContent } from 'src/assets/models/order-details';
import { ToastComponent } from '../toast/toast.component';
import { CartItem } from 'src/assets/models/products';
import { ToasterComponent } from '../toaster/toaster/toaster.component';
import { Address } from 'src/assets/models/deliveryinfo';

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
  @Input() type: string = 'item';
  @Output() confirmDialogOutput = new EventEmitter<boolean>();
  @Output() cancelOrderOutput = new EventEmitter<{id: string, reason: string}>();
  @Output() emitActivateToast = new EventEmitter<string[]>();
  @Output() emitEditCart = new EventEmitter<{newCartItem: CartItem, cartIndex: number}>
  @Output() reviewSuccess = new EventEmitter();
  @Output() returnOrderOutput = new EventEmitter<{id: string, reason: string}>();
  @Output() emitShippingProof = new EventEmitter<{id: string, file: File}>();
  @Output() emitSelectedAddress = new EventEmitter<string>();
  modalTitle!: string;

  toastTheme!: string;
  toastHeader!: string;
  toastContent!: string;
  //@ViewChild(ToasterComponent) toaster: ToasterComponent;

  modalEl: bootstrap.Modal;

  // review resources
  product!: any;

  order: string;

  // addresses

  userAddresses: Address[];

  ngOnInit(): void {
    
   /*  switch (this.mode) {
      case "add-review":
        
        break;
    
      default:
        break;
    } */
  }

  ngAfterViewInit(): void {
    this.modalEl = new bootstrap.Modal(this.modal.nativeElement, {backdrop: 'static', keyboard: false});
  }

  // Select Address

  selectAddress(address: Address[]): void {
    this.mode = 'select-address'
    this.modalTitle = 'Select Address'
    this.userAddresses = address;
    this.show();
  }

  emitAddressSelect(id: string): void {
    this.emitSelectedAddress.emit(id);
  }

  // Return Order

  returnOrder(order_id: string): void {
   // console.log('return-order, modal')
    this.mode = 'return-order';
    this.modalTitle = 'Return Order';
    this.order = order_id;
    this.show();
  }

  emitReturnOrder($event: { id: string; reason: string; }) {
    //('return-order emit, modal')
    this.returnOrderOutput.emit({id: $event.id, reason: $event.reason})
  }

  // Upload Shipping Proof

  uploadShippingProof(order_id: string): void {
    this.mode = 'upload-shipping-proof';
    this.modalTitle = 'Upload Proof of Shipping';
    this.order = order_id;
    //console.log("modal client", order_id)
    //console.log("modal client variable", this.order)
    this.show();
  }

  shippingProofEmit(params: {id: string, file: File}){
    this.emitShippingProof.emit(params);
  }

  // My Styles Primer

  myStylesPrimer() {
    this.mode = 'my-styles-primer';
    this.modalTitle = "My Styles";
    //console.log("Local Storage (Don't Show): " + (localStorage.getItem('myStylesDontShow') == 'true'));
    //console.log("Session Storage (Shown): " + (sessionStorage.getItem('myStylesShown') == 'true'))
    
    if(!(localStorage.getItem('myStylesDontShow') == 'true') && !(sessionStorage.getItem('myStylesShown') == 'true')){
      this.show();
    }
  }

  // Setup Reminder Methods

  setupReminder(){
    this.mode = "setup-reminder";
    this.modalTitle = "Profile Setup";
    this.show();
  }

  // Cancel Order Methods 

  cancelOrder(order_id: string){
    this.mode = "cancel-order"
    this.modalTitle = "Cancel Order";
    this.order = order_id;
    this.show();
  }

  emitCancelOrder($event: { id: string; reason: string; }) {
    this.cancelOrderOutput.emit({id: $event.id, reason: $event.reason})
  }

  // Review Methods

  addReview(item: OrderContent): void {
    //console.log(this.mode);
    //console.log(this.modalTitle)
    this.modalTitle = "Add Review";
    this.product = item;
    this.show();
  }

  emitReviewSuccess(): void {
    this.reviewSuccess.emit();
  }

  // Confirm Dialog Methods

  confirmRemoveCartItem(item: CartItem){
    this.modalTitle = "Remove from Cart";
    this.operation = "delete";
    this.context = "cart";
    this.product = item;
    this.show()
  }

  confirmRemoveAddress(item: string){
    this.mode = 'confirm-dialog'
    this.modalTitle = "Confirm"
    this.operation = "delete"
    this.type = 'address'
    this.show();
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

  emitEditCartItem(event: {newCartItem: CartItem, cartIndex: number}): void {
    this.emitEditCart.emit(event)
    this.dismiss();
  }

  show(): void {
    this.modalEl.show();
  }

  dismiss(): void {
    //console.log('dismiss from modal');
    this.modalEl.hide();
  }

  dismissMyStyles(flag: boolean): void {
    if(flag){
      localStorage.setItem('myStylesDontShow', 'true');
      this.modalEl.hide();
    }
    else {
      sessionStorage.setItem('myStylesShown', 'true');
      this.modalEl.hide();
    }
  }

  activateToast(data: string[]): void {
    //this.toaster.showToast(data[0], data[1], data[2])
    this.emitActivateToast.emit(data)
  }
 
}
