import { Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem } from 'src/assets/models/products';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { User } from 'src/assets/models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Carousel } from 'bootstrap';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  parseFloat = parseFloat;

  @ViewChild('carousel') carousel: ElementRef;

  isPage1Validated: boolean;
  isItemSelected: boolean = true;
  
  cartContents!: CartItem[];
  orderList: CartItem[] = [];
  subtotal: number = 0;

  imgpath: string = ""; 
  imgname: string = "";

  user: User;

  // items are separate from the formgroup but both the orderList array and orderForm must be valid
  orderForm = new FormGroup({
    orderAddress: new FormControl('', Validators.required),
    orderPaymentMethod: new FormControl('', Validators.required),
    orderPaymentProof: new FormControl('', Validators.required)
  })

  get orderItems() { return this.orderForm.get('orderItems') }
  get orderAddress() { return this.orderForm.get('orderAddress') }
  get orderPaymentMethod() { return this.orderForm.get('orderPaymentMethod') }
  get orderPaymentProof() { return this.orderForm.get('orderPaymentProof') }


  constructor(private cart: CartService,
              public accountService: AccountsService) {}

  ngOnInit() {
    this.cartContents = this.cart.getItems();
    //this.user = this.accountService.getCurrentUser();
  }

  ngAfterViewInit() {
    console.log(this.carousel);
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
      this.subtotal = parseFloat(this.cartContents[index].product.product_variants[variantIndex].price) * this.cartContents[index].quantity;
    }
    else {
      this.subtotal += this.cartContents[index].product.price * this.cartContents[index].quantity;
    }
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
        this.subtotal -= parseInt(this.orderList[i].product.product_variants[variantIndex].price) * this.orderList[i].quantity;
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

  validatePage1(): void {
    console.log(this.orderPaymentMethod?.value);
    if(this.orderPaymentMethod?.valid && this.orderList.length > 0){
      const instance = new bootstrap.Carousel(this.carousel.nativeElement);
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
    }
  }

  validatePage2(): void {
    if(this.orderPaymentProof?.valid){
      const instance = new bootstrap.Carousel(this.carousel.nativeElement);
      instance.next();
    }
    else {
      this.orderPaymentProof?.markAsTouched();
    }
  }

  order(): void {

  }
}

