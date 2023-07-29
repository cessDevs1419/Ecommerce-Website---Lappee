import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { OrderContent } from 'src/assets/models/order-details';

@Component({
  selector: 'app-modal-client',
  templateUrl: './modal-client.component.html',
  styleUrls: ['./modal-client.component.css']
})
export class ModalClientComponent {

  @ViewChild('modal') modal: ElementRef;
  @Input() mode: string = "";
  modalTitle!: string;

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

  addReview(item: OrderContent): void {
    console.log(this.mode);
    console.log(this.modalTitle)
    this.modalTitle = "Add Review";
    this.product = item;
    this.show();
  }

  show(): void {
    const modalShow = new bootstrap.Modal(this.modal.nativeElement);
    modalShow.show();
  }
 
}
