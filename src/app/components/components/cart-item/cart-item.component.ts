import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CartItem } from 'src/assets/models/products';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {

  @Input() componentId !: String;
  @Input() index!: number;
  @Input() cartItem!: CartItem;
  @Output() addOrderList: EventEmitter<any> = new EventEmitter();
  @Output() removeOrderList: EventEmitter<any> = new EventEmitter();
  
  isIncluded: boolean = false;
  selectedColor: string = "#DDDEE3";
  priceConvert: number;

  ngOnInit(): void {
    this.priceConvert = Number(this.cartItem.price);
  }

  emit(): void {
    this.isIncluded = !this.isIncluded;
    console.log("isIncluded: " + this.isIncluded);
    if(this.isIncluded){
      this.addOrderList.emit(this.index);
    }
    else {
      this.removeOrderList.emit(this.cartItem);
    }
  }
}
