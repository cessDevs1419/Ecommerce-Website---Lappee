import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem } from 'src/assets/models/products';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  cartContents!: CartItem[];
  orderList: CartItem[] = [];
  subtotal: number = 0;

  constructor(private cart: CartService) {}

  ngOnInit() {
    this.cartContents = this.cart.getItems();
  }

  matchProduct(sender: any, operation: string) {
   
  }

  addToOrder(index: number) {
    this.orderList.push(this.cartContents[index]);
    this.subtotal += this.cartContents[index].product.price;
  }

  removeFromOrder(sender: CartItem){
    let matchIndex = -1;
    for(let i = 0; i <= this.orderList.length - 1; i++){
      let orderIdVariant = this.orderList[i].product.id + this.orderList[i].variant;
      let cartIdVariant = sender.product.id + sender.variant;

      console.log('Currently matching: ' + orderIdVariant + " | " + cartIdVariant);

      if(orderIdVariant == cartIdVariant){
        matchIndex = i;
        this.subtotal -= this.orderList[i].product.price;
        console.log('Match found at index ' + i);
      }
    }

    // match found
    if(matchIndex != -1){
      this.orderList.splice(matchIndex, 1);
    }
    else {
      console.log('no matches')
    }

  }
}

