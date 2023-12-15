import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CartItem, Product, Variant } from 'src/assets/models/products';

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
  @Output() removeCartItem: EventEmitter<CartItem> = new EventEmitter(); 
  @Output() editCartItem: EventEmitter<CartItem> = new EventEmitter();
  
  isIncluded: boolean = false;
  selectedColor: string = "#DDDEE3";
  priceConvert: number;
  maxStock: number = 0;

  ngOnInit(): void {
    this.priceConvert = Number(this.cartItem.price);
    this.updateStockInfo();
  }

  ngOnChanges(): void {
    this.updateStockInfo();
  }

  matchVariantId(variant_id: string): number {

    let matchIndex = -1

    this.cartItem.product.variants.forEach((variant: Variant, index: number) => {
      // console.log(variant_id == variant.variant_id ,variant_id, variant.variant_id)
      if(variant_id == variant.variant_id){
        matchIndex = index
      }
    })
    return matchIndex
  } 

  updateStockInfo(): void {
    // console.log("Cart Item pass", this.productArray);
    // console.log(this.cartItem);
    let matchIndex = this.matchVariantId(this.cartItem.variant)
    // console.log(matchIndex)
    // console.log(this.cartItem.variant, this.cartItem.product.variants[this.matchVariantId(this.cartItem.variant)].stock)
    
    if(this.cartItem.product.variants[this.matchVariantId(this.cartItem.variant)].stock){
      this.maxStock = this.cartItem.product.variants[this.matchVariantId(this.cartItem.variant)].stock
    }
    
    // if(this.productArray){
    //   this.productArray.forEach((product, index) => {
    //     if(product.id == this.cartItem.product.id){
    //       product.variants.forEach((variant, index) => {
    //         if(variant.variant_id == this.cartItem.variant){
    //           this.maxStock = variant.stock;
    //         }
    //       })
    //     }
    //   })
    // }
  }

  emit(): void {
    if(this.selectAll && this.maxStock == 0){
      this.selectAll = false;
    }
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

  handleRemoveItem(variant_id: string): void {
    if(this.isIncluded){
      this.removeOrderList.emit(this.cartItem);
    }
    this.removeCartItem.emit(this.cartItem);
  }

  handleEditItem(item: CartItem): void {
    this.editCartItem.emit(item);
  }
}
