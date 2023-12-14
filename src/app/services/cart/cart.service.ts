import { Product, CartItem, CartItemAPI, CartItemResponse, CartItemList, Variant } from 'src/assets/models/products';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DELETECartItems, GETCartItems, POSTCartItems } from '../endpoints';
import { formatCartItem } from 'src/app/utilities/response-utils';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: CartItem[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  };


  constructor(private http: HttpClient) { 
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
   this.initializeCart();
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    //this.initializeCart();
  }

  initializeCart(): void {
    let data: Observable<CartItemList> = this.getCartFromAPI().pipe(map((response: any) => formatCartItem(response) )); 
    
    // convert to proper cartitem

    console.log(' init cart ')
    
    data.subscribe((data: CartItemList) => {
      console.log(data)
      data.items.forEach((item: CartItemAPI) => {
        let product = item.product;
        let variantCopy = item.selected_variant;
        let quantity = item.quantity
        let variant_details;
        let price;
        let imgurl;

        let variantObj: Variant = item.product.variants.find((variant: Variant) => variant.variant_id == variantCopy)!

        // bind variant_details
        let map = new Map<string, string>();
        variantObj.attributes.forEach(attr => {
          map.set(attr.attribute_name, attr.value);
        })
        variant_details = map;

        // bind price
        price = variantObj.price;

        // bind img urls
        imgurl = variantObj.images;

        // add to cart

        this.addToCart(product, variantCopy, map, quantity, price, imgurl);
      })
    })
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

    // submit updated cart item to API
    let matchIndex = this.getItems().findIndex((item: CartItem) => item.product.id == cartItem.product.id && item.variant == cartItem.variant)
    let formdata: any = new FormData();
    formdata.append('product_id', cartItem.product.id);
    formdata.append('variant_id', cartItem.variant);
    formdata.append('quantity', this.items[matchIndex].quantity);

    this.postStoreCart(formdata).subscribe({
      next: (response: any) => {
        console.log('added');
        //this.initializeCart();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })

    console.log(this.getItems);
  }

  removeItem(index: number){
    console.log(index)
    let product_id = this.items[index].product.id;
    let variant_id = this.items[index].variant

    let formdata = new FormData()
    formdata.append('product_id', product_id);
    formdata.append('variant_id', variant_id)

    this.deleteStoreCart(formdata).subscribe({
      next: (response:any) => {
        
            if(this.items.length > 0){
              this.items.splice(index, 1);
            }
            else {
              this.items = [];
            }
            console.log(this.items)
      },
      error: (err: HttpErrorResponse) => {
        console.log("tulog na")
      }
    })


  }

  getItems(): CartItem[] {
    return this.items;
  }

  clearCart(): CartItem[] {
    this.items = [];
    return this.items;
  }
  
  getCartFromAPI(): Observable<CartItemResponse> {
    return this.http.get<CartItemResponse>(GETCartItems)
  }

  postStoreCart(data: FormData): Observable<any> {
    return this.http.post(POSTCartItems, data, this.httpOptions);
  }

  deleteStoreCart(data: FormData): Observable<any> {
    return this.http.delete(DELETECartItems, { 
      body: data,
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      })
    })
  }

}
