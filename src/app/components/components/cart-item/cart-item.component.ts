import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CartItem, Product } from 'src/assets/models/products';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {

  @Input() componentId !: String;
  @Input() index!: number;
  @Input() cartItem!: CartItem;
  @Input() productArray: Product[] = [];
  @Input() selectAll: boolean = false
  @Output() addOrderList: EventEmitter<any> = new EventEmitter();
  @Output() removeOrderList: EventEmitter<any> = new EventEmitter();
  @Output() changeQuantity: EventEmitter<string[]> = new EventEmitter();
  
  isIncluded: boolean = false;
  selectedColor: string = "#DDDEE3";
  priceConvert: number;
  maxStock: number = 10;

  ngOnInit(): void {
    this.priceConvert = Number(this.cartItem.price);
    this.updateStockInfo();
  }

  ngOnChanges(): void {
    this.updateStockInfo();
  }

  updateStockInfo(): void {
    if(this.productArray){
      this.productArray.forEach((product, index) => {
        if(product.id == this.cartItem.product.id){
          product.product_variants.forEach((variant, index) => {
            if(variant.variant_id == this.cartItem.variant){
              this.maxStock = variant.stock;
            }
          })
        }
      })
    }
  }

  emit(): void {
    this.isIncluded = !this.isIncluded;
    console.log("isIncluded: " + this.isIncluded);
    console.log("selectAll: " + this.selectAll);
    if(this.isIncluded){
      this.addOrderList.emit(this.index);
    }
    else {
      this.removeOrderList.emit(this.cartItem);
    }
  }

  handleQuantityChange(number: number): void {
    this.changeQuantity.emit([this.index.toString(), number.toString()]);
  }
}
