import { Product, CartItem } from 'src/assets/models/products';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: CartItem[] = [];

  constructor() { }

  addToCart(product: Product, variant: string, quantity: number): void {
    let duplicate = -1;
    let cartItem: CartItem = {
      product: product,
      variant: variant,
      quantity: quantity
    }

    // check for duplicates if items is not null
    if(this.items.length != 0){
      for(let i = 0; i+1 <= this.items.length; i++){
        if((this.items[i].product == product) && (this.items[i].variant == variant)){
          duplicate = i;
        }
      }
    }
    
    // no duplicates
    if(duplicate == -1){
      this.items.push(cartItem);
    }
    else {
      this.items[duplicate].quantity += quantity;
    }

    console.log(this.getItems);
  }

  getItems(): CartItem[] {
    return this.items;
  }

  clearCart(): CartItem[] {
    this.items = [];
    return this.items;
  }
  
  

}
