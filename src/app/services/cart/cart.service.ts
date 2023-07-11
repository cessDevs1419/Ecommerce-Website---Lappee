import { Product, CartItem } from 'src/assets/models/products';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: CartItem[] = [];

  constructor() { }

  addToCart(product: Product, variant: string, variant_details: string, quantity: number): void {
    let duplicate = -1;
    let cartItem: CartItem = {
      product: product,
      variant: variant,
      variant_details: variant_details,
      quantity: quantity
    }
    // check for duplicates if items is not null
    if(this.items.length != 0){

      this.items.forEach( (item: CartItem, index: number) => {
        console.log("Checking: " + cartItem.product.name + " " + cartItem.variant + " | " + item.product.name + " " + item.variant);

        if((item.product.name === cartItem.product.name) && (item.variant === cartItem.variant)){
          console.log(" true, duplicate")
          duplicate = index;
        }

        else {
          console.log('false, no duplicates')
        }
      })

      /* for(let i = 0; i <= this.items.length; i++){
        console.log("Checking: " + cartItem.product + " " + cartItem.variant + " | " + this.items[i].product + " " + this.items[i].variant);

        if((this.items[i]) && (this.items[i].product === product) && (this.items[i].variant === variant)){
          console.log(" true, duplicate")
          duplicate = i;
          break;
        }

        else {
          console.log('no duplicates');
        }
      } */
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
