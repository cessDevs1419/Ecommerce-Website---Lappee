import { Product, CartItem } from 'src/assets/models/products';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: CartItem[] = [];

  constructor() { 
    /*
    this.items.push({
      product: {
        id: 'product1',
        name: 'ONLV Red Shirt',
        sub_category_id: 'subcat1',
        description: 'A red shirt from One Love Clothing Co.',
        images: ["https://picsum.photos/800"],
        product_variants: [
          {
            variant_id: "var1",
            product_id: 'product1',
            color: 'd2d2d2',
            color_title: 'Ash Gray',
            size: 'XL',
            stock: 99,
            stock_limit: 10,
            price: "650.00",
            attributes: [

            ]
          },
        ]
      },
      variant: 'Size: XL | Color: Ash Gray',
      variant_details: [],
      quantity: 2,
      price: '650.00',
      image_url: 'https://picsum.photos/800'
    })
    */
  }

  ngOnInit(): void {
    
  }

  addToCart(product: Product, variant: string, variant_details: Map<string, string>, quantity: number, price: string, imgurl: string[]): void {
    let duplicate = -1;
    let cartItem: CartItem = {
      product: product,
      variant: variant,
      variant_details: variant_details,
      quantity: quantity,
      price: price,
      image_url: imgurl
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
    }
    
    if(duplicate == -1){
      this.items.push(cartItem);
    }
    else {
      this.items[duplicate].quantity += quantity;
    }
    console.log(this.getItems);
  }

  removeItem(index: number){
    if(this.items.length > 1){
      this.items.splice(index, 1);
    }
    else {
      this.items = [];
    }
    console.log(this.items)
  }

  getItems(): CartItem[] {
    return this.items;
  }

  clearCart(): CartItem[] {
    this.items = [];
    return this.items;
  }
  
  

}
