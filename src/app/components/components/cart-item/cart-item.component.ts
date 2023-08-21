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
        console.log(index);
        if(product.id == this.cartItem.product.id){
          product.product_variants.forEach((variant, index) => {
            if(variant.variant_id == this.cartItem.variant){
              this.maxStock = variant.stock;
            }
          })
        }
      })
    }
    console.log(this.productArray);
    console.log(this.maxStock);
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

  handleQuantityChange(number: number): void {
    this.changeQuantity.emit([this.index.toString(), number.toString()]);
  }
}
