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

  constructor(private cart: CartService) {}

  ngOnInit() {
    this.cartContents = this.cart.getItems();
  }
}

