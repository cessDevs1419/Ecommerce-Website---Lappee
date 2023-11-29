import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewChildren, QueryList, ChangeDetectorRef} from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem, Order, Product, Variant } from 'src/assets/models/products';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { User } from 'src/assets/models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Carousel } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { DeliveryinfoService } from 'src/app/services/delivery/deliveryinfo.service';
import { DeliveryInfo } from 'src/assets/models/deliveryinfo';
import { Observable, map } from 'rxjs';
import { filterDeliveryInfo, formatDeliveryInfo, findDeliveryInfo, formatProducts } from 'src/app/utilities/response-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from 'src/app/services/order/order.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  Number = Number;

  mode: string = "";
  modalSize: string = "modal-lg";

  reminderShown: boolean = false;

  @ViewChild('carousel') carousel: ElementRef;
  @ViewChild('orderPaymentProofInput') imginput: ElementRef;
  @ViewChild(ModalClientComponent) modal: ModalClientComponent;
  @ViewChildren('itemCheckbox') itemChkBoxes: QueryList<any>;


  isPage1Validated: boolean;
  isItemSelected: boolean = true;
  isInfoSelected: boolean = true;

  products: Product[];

  infos!: Observable<DeliveryInfo[]>;
  isInfoRegistered!: boolean
  filteredInfo!: Observable<DeliveryInfo[]>

  address!: string;
  telephone!: string;
  
  cartContents!: CartItem[];
  orderList: CartItem[] = [];
  subtotal: number = 0;

  imgpath: string = ""; 
  imgname: string = "";
  imgfile!: File;

  user: User;

  orderedProducts: Order[] = [];

  orderId: string;
  
  orderPaymentProofError: boolean = false;

  selectAllFlag: boolean = false;

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
              private deliveryInfoService: DeliveryinfoService,
              private orderService: OrderService,
              private productsService: ProductsService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cartContents = this.cart.getItems();
    this.checkAddress();
    let products = this.productsService.getProducts().pipe(map((response:any) => formatProducts(response)));
    products.subscribe({
      next: (response: any) => {
        this.products = response;
        console.log("Cart Fetch: ", this.products);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })
  }

  ngAfterViewInit() {
    console.log(this.carousel);
  }

  checkAddress() {
    this.infos = this.deliveryInfoService.getDeliveryInfo().pipe(map((response: any) => formatDeliveryInfo(response)));
    this.accountService.checkLoggedIn().subscribe({
      next: (response: any) => {
        if(response) {
          this.accountService.getLoggedUser().subscribe({
            next: (response: any) => {
              findDeliveryInfo(response.user_id, this.infos).subscribe({
                next: (match: boolean) => {
                  if(match) {
                    console.log('has matching address')
                    this.isInfoRegistered = true;
                    this.filteredInfo = filterDeliveryInfo(response.user_id, this.infos);
                    this.filteredInfo.subscribe({
                      next: (info: DeliveryInfo[]) => {
                        if(info){
                          this.isInfoSelected = true;
                        }
                        else {
                          this.isInfoSelected = false;
                        }
                      }
                    });
                  }
                  else {
                    console.log('no matching address');
                    this.isInfoRegistered = false;
                    console.log("Reminder: " + sessionStorage.getItem('reminderShown'))
                    if(sessionStorage.getItem('reminderShown') !== 'true'){
                      setTimeout(() => {
                        this.setupReminderModal();
                      }, 3000);
                      sessionStorage.setItem('reminderShown', 'true');
                    }
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

  setupReminderModal(): void {
    this.mode = 'setup-reminder';
    this.modalSize = 'modal-md';
    this.modal.setupReminder();
  }

  selectAll() {
    this.selectAllFlag = !this.selectAllFlag;
    console.log(this.selectAllFlag);
  }

  matchOrderListToCart(index: number): number {
    let matchindex =-1;
    let orderlistvariant = this.orderList[index].variant;
    let orderlistitem = this.orderList[index].product.id;
    this.cartContents.forEach((item: CartItem, index: number) => {
      //find same product id
      if(orderlistitem === item.product.id){
        console.log("Found match: " + orderlistitem + " | " + item.product.id);
        let cartItemIndex = index;

        item.product.variants.forEach((variant: Variant, index: number) => {
          if(orderlistvariant === variant.variant_id){
            console.log("Found matching variant: " + orderlistvariant + " | " + variant.variant_id);
            matchindex = cartItemIndex;
            console.log("Cart index is [" + matchindex +"]")
            return;
          }
        })
      }
    })
    return matchindex;
  }

  matchIndexAndVariant(index: number): number {
    let matchIndex =-1;
    let variantId = this.cartContents[index].variant;
    this.cartContents[index].product.variants.forEach((variant: any, index: number) => {
      if(variantId === variant.variant_id){
        matchIndex = index;
      }
    });
    return matchIndex;
  }

  matchCartItemAndVariant(sender: CartItem): number {
    let matchIndex = -1
    let variantId = sender.variant;
    sender.product.variants.forEach((variant: any, index: number) => {
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
      this.subtotal += Number(this.cartContents[index].product.variants[variantIndex].price) * this.cartContents[index].quantity;
    }
    /* else {
      this.subtotal += this.cartContents[index].product.price * this.cartContents[index].quantity;
    } */
    this.isItemSelected = true;
  }

  removeFromCart(item: CartItem): void {
    this.mode = "confirm-dialog";
    this.modal.confirmRemoveCartItem(item);
  }

  confirmRemoveCartItem(params: any) {
    if(params.status){
      let index = this.matchCartItemAndVariant(params.item);
      console.log(index);
      this.cart.removeItem(index);
      this.cartContents = this.cart.getItems();
    }
  }

  editCartItem(item: CartItem): void {
    this.mode = "edit-cart-item";
    this.modalSize = 'modal-lg';
    this.modal.editCartItem(item);
  }

  editCartItemOrder(event: {newCartItem: CartItem, cartIndex: number}): void {
    this.removeFromOrder(this.cart.items[event.cartIndex]);
    this.cart.items[event.cartIndex] = event.newCartItem;
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
        this.subtotal -= Number(this.orderList[i].product.variants[variantIndex].price) * this.orderList[i].quantity;
        console.log('Match found at index ' + i);
      }
    }
    // match found
    if(matchIndex != -1){
      if(this.orderList.length > 1){
        this.orderList.splice(matchIndex, 1);
      }
      else {
        this.orderList = [];
      }
    }
    else {
      console.log('no matches')
    }
    if(this.orderList.length == 0){
      this.isItemSelected = false;
    }
  }

  changeQuantity(params: string[]): void {
    console.log("change quantity cart page");
    let variantIndex = this.matchIndexAndVariant(Number(params[0]));
    this.cartContents[Number(params[0])].quantity = Number(params[1]);
    let updatedSubtotal: number = 0;
    this.orderList.forEach(item => {
      updatedSubtotal += Number(item.product.variants[variantIndex].price) * item.quantity;
    })

    this.subtotal = updatedSubtotal;
  }

  imageUpload(event: any): void {
    let img: File = event.target.files[0];
    let reader = new FileReader();
    this.imgfile = img;

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
    if(this.orderPaymentMethod?.valid && this.orderList.length > 0 && this.accountService.getIsLoggedIn() && this.isInfoRegistered){
      const instance = new bootstrap.Carousel(this.carousel.nativeElement);
      this.isItemSelected = true;
      this.isInfoSelected = true;
      if(this.orderPaymentMethod.value == "gcash"){
        instance.next();
      }
      else {
        instance.to(3);
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

      if(!this.accountService.getIsLoggedIn() || !this.isInfoRegistered){
        this.isInfoSelected = false;
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
    console.log("trigger order");

    if(this.orderForm?.valid && this.orderList.length > 0 && this.isInfoSelected){

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

      if(this.imgfile){
        formData.append('proofs[]', this.imgfile);
      }

      console.log(formData);

      this.orderService.postOrder(formData).subscribe({
        next: (response: any) => {
          console.log(response.data.order_id);
          this.orderId = response.data.order_id;
          const instance = new bootstrap.Carousel(this.carousel.nativeElement);
          instance.next();

          //remove ordered items
          this.orderList.forEach((item: CartItem ,index: number) => {
            let itemMatch = this.matchOrderListToCart(index);
            if(itemMatch > -1) {
              this.cartContents.splice(itemMatch, 1);
            }
          })
        },
        error: (err: HttpErrorResponse) => {
          console.log(err)
        }
      })

    }
    else {
      console.log("Order Form Valid: " + this.orderForm?.valid);
      console.log("Order List: " + this.orderList.length);
      console.log("Address Selected: " + this.isInfoSelected);
      console.log("Total check: " + (this.orderForm?.valid && this.orderList.length > 0 && this.isInfoSelected))

    }
  }
}
