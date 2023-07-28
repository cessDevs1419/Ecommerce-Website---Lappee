import { Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem, Order } from 'src/assets/models/products';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { User } from 'src/assets/models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Carousel } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { AddressService } from 'src/app/services/address/address.service';
import { Address } from 'src/assets/models/address';
import { Observable, map } from 'rxjs';
import { filterAddresses, findAddresses, formatAddress } from 'src/app/utilities/response-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  Number = Number;

  @ViewChild('carousel') carousel: ElementRef;
  @ViewChild('orderPaymentProofInput') imginput: ElementRef;

  isPage1Validated: boolean;
  isItemSelected: boolean = true;
  isAddressSelected: boolean = true;

  addresses!: Observable<Address[]>;
  isAddressRegistered!: boolean
  filteredAddress!: Observable<Address | null>

  address!: string;
  
  cartContents!: CartItem[];
  orderList: CartItem[] = [];
  subtotal: number = 0;

  imgpath: string = ""; 
  imgname: string = "";

  user: User;

  orderedProducts: Order[] = [];

  orderId: string;
  
  orderPaymentProofError: boolean = false;

  // items are separate from the formgroup but both the orderList array and orderForm must be valid
  orderForm = new FormGroup({
    orderPaymentMethod: new FormControl('', Validators.required),
    orderPaymentProof: new FormControl('')
  })

  get orderItems() { return this.orderForm.get('orderItems') }
  get orderAddress() { return this.orderForm.get('orderAddress') }
  get orderPaymentMethod() { return this.orderForm.get('orderPaymentMethod') }
  get orderPaymentProof() { return this.orderForm.get('orderPaymentProof') }


  constructor(private cart: CartService,
              public accountService: AccountsService,
              private addressService: AddressService,
              private orderService: OrderService) {}

  ngOnInit() {
    this.cartContents = this.cart.getItems();
    this.checkAddress();
    //this.user = this.accountService.getCurrentUser();
  }

  ngAfterViewInit() {
    console.log(this.carousel);
  }

  checkAddress() {
    this.addresses = this.addressService.getAddresses().pipe(map((response: any) => formatAddress(response)));
    this.accountService.checkLoggedIn().subscribe({
      next: (response: any) => {
        if(response) {
          this.accountService.getLoggedUser().subscribe({
            next: (response: any) => {
              findAddresses(response.user_id, this.addresses).subscribe({
                next: (match: boolean) => {
                  if(match) {
                    console.log('has matching address')
                    this.isAddressRegistered = true;
                    this.filteredAddress = filterAddresses(response.user_id, this.addresses);
                    this.filteredAddress.subscribe({
                      next: (address: Address | null) => {
                        if(address){
                          this.isAddressSelected = true;
                        }
                        else {
                          this.isAddressSelected = false;
                        }
                      }
                    });
                  }
                  else {
                    console.log('no matching address')
                    this.isAddressRegistered = false;
                  }
                },
                error: (err: HttpErrorResponse) => {
                  console.log(err)
                }
              })
            },
            error: (err: HttpErrorResponse) => {
              console.log(err)
            }
          });
        }
      }
    });
  }

  matchProduct(sender: any, operation: string): void {
   
  }

  matchIndexAndVariant(index: number): number {
    let matchIndex =-1;
    let variantId = this.cartContents[index].variant;
    this.cartContents[index].product.product_variants.forEach((variant: any, index: number) => {
      if(variantId === variant.variant_id){
        matchIndex = index;
      }
    });
    return matchIndex;
  }

  matchCartItemAndVariant(sender: CartItem): number {
    let matchIndex = -1
    let variantId = sender.variant;
    sender.product.product_variants.forEach((variant: any, index: number) => {
      if(variantId === variant.variant_id){
        matchIndex = index;
      }
    });
    return matchIndex;
  }

  addToOrder(index: number): void {
    this.orderList.push(this.cartContents[index]);

    if(this.cartContents[index].variant){
      let variantIndex = this.matchIndexAndVariant(index);
      this.subtotal += Number(this.cartContents[index].product.product_variants[variantIndex].price) * this.cartContents[index].quantity;
    }
    /* else {
      this.subtotal += this.cartContents[index].product.price * this.cartContents[index].quantity;
    } */
    this.isItemSelected = true;
  }

  removeFromOrder(sender: CartItem): void {
    let matchIndex = -1;
    let variantIndex = this.matchCartItemAndVariant(sender);
    for(let i = 0; i <= this.orderList.length - 1; i++){
      let orderIdVariant = this.orderList[i].product.id + this.orderList[i].variant;
      let cartIdVariant = sender.product.id + sender.variant;

      console.log('Currently matching: ' + orderIdVariant + " | " + cartIdVariant);

      if(orderIdVariant == cartIdVariant){
        matchIndex = i;
        this.subtotal -= Number(this.orderList[i].product.product_variants[variantIndex].price) * this.orderList[i].quantity;
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
    if(this.orderList.length == 0){
      this.isItemSelected = false;
    }
  }

  imageUpload(event: any): void {
    let img: File = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.imgpath = e.target.result;
    }

    this.imgname = img.name;
    reader.readAsDataURL(img);
  }

  clearImg(event: any): void {
    this.imginput.nativeElement.value = null;
    this.imginput.nativeElement.files = null;
    this.imgpath = '';
    this.imgname = ''; 
    this.orderPaymentProof?.setValue(null);
    console.log("Img Proof: " + this.orderPaymentProof?.valid);
  }

  prevPage(): void {
    const instance = new bootstrap.Carousel(this.carousel.nativeElement);
    if(this.orderPaymentMethod?.value == "gcash"){
      instance.prev();
    }
    else {
      instance.to(0);
    }
  }

  nextPage(): void {
    const instance = new bootstrap.Carousel(this.carousel.nativeElement);
    instance.next();
  }

  validatePage1(): void {
    console.log(this.orderPaymentMethod?.value);
    if(this.orderPaymentMethod?.valid && this.orderList.length > 0 && this.accountService.getIsLoggedIn()){
      const instance = new bootstrap.Carousel(this.carousel.nativeElement);
      this.isItemSelected = true;
      this.isAddressSelected = true;
      if(this.orderPaymentMethod.value == "gcash"){
        instance.next();
      }
      else {
        instance.to(2);
      }
    }
    else {
      console.log('Payment: ' + this.orderPaymentMethod?.valid);
      console.log('Items: ' + this.isItemSelected);
      this.orderPaymentMethod?.markAsTouched();
      //this.orderAddress?.markAsTouched();

      if(this.orderList.length == 0){
        this.isItemSelected = false;
      }

      if(!this.accountService.getIsLoggedIn()){
        this.isAddressSelected = false;
      }
    }
  }

  validatePage2(): void {
    if(this.orderPaymentProof?.value){
      console.log(this.orderPaymentProof.value);
      const instance = new bootstrap.Carousel(this.carousel.nativeElement);
      instance.next();
    }
    else {
      this.orderPaymentProofError = true;
      this.orderPaymentProof?.markAsTouched();
    }
  }

  order(): void {
    //final checks
    if(this.orderForm?.valid && this.orderList.length > 0 && this.isAddressSelected){

      //post the request here
      for(let order of this.orderList){
        this.orderedProducts.push({ id: order.product.id, variant_id: order.variant, quantity: order.quantity })
      }

      let formData = new FormData();
      this.orderedProducts.forEach((item, index) => {
        formData.append('products[' + index + "][id]", item.id);
        formData.append('products[' + index + "][variant_id]", item.variant_id);
        formData.append('products[' + index + "][quantity]", item.quantity.toString());
      });

      console.log(formData);

      this.orderService.postOrder(formData).subscribe({
        next: (response: any) => {
          console.log(response.data.order_id);
          this.orderId = response.data.order_id;
          const instance = new bootstrap.Carousel(this.carousel.nativeElement);
          instance.next();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err)
        }
      })

    }
    else {
      console.log("Order Form Valid: " + this.orderForm?.valid);
      console.log("Order List: " + this.orderList.length);
      console.log("Address Selected: " + this.isAddressSelected);
      console.log("Total check: " + (this.orderForm?.valid && this.orderList.length > 0 && this.isAddressSelected))

    }
  }
}

