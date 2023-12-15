import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersComponent } from '../../orders/orders.component';
import { OrderService } from 'src/app/services/order/order.service';
import { Order } from 'src/assets/models/products';
import { AdminOrder, OrderContent, OrderDetail, OrderList } from 'src/assets/models/order-details';
import { formatAdminOrder, formatOrderDetails } from 'src/app/utilities/response-utils';
import { Observable, Subject, map, startWith, switchMap, tap } from 'rxjs';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';
import { POSTCancelOrder } from 'src/app/services/endpoints';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { User } from 'src/assets/models/user';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {


  Number = Number;
  constructor (private http: HttpClient, private route: ActivatedRoute, private orderService: OrderService, private accountService: AccountsService, private router: Router, private eh: ErrorHandlerService) {
    this.orderId = String(this.route.snapshot.paramMap.get('orderId'))
  }

  user: Observable<User> = this.accountService.getLoggedUser();
  mode: string;
  orderId: string = "";
  orderDetails: Observable<OrderDetail[]>;
  orders!: Observable<AdminOrder[]>;

  orderStatusMode: string;

  orderSubtotal: number = 0;
  isCancelRequest: boolean = false;
  @ViewChild(ModalClientComponent) modal: ModalClientComponent;
  @ViewChild(ToasterComponent) toaster: ToasterComponent;
	private refreshData$ = new Subject<void>();
  
  ngOnInit(): void {
    this.orderDetails = this.orderService.getOrderDetail(this.orderId).pipe(map((response: any) => formatOrderDetails(response)));
    this.orderDetails.subscribe((orders: OrderDetail[]) => {
      orders[0].order_contents.forEach((item: OrderContent) => {
        this.orderSubtotal += this.Number(item.sub_price)
      })

      if(orders[0].status == 15 || orders[0].status == 10 || orders[0].status == 51){
        this.orderStatusMode = 'cancel';
      }
      else if(orders[0].status == 300 || orders[0].status == 310 || orders[0].status == 320 || orders[0].status == 330){
        this.orderStatusMode = 'return'
      }
      else {
        this.orderStatusMode = 'default';
      }
    }) 

  }

  refreshTableData(): void {
    this.refreshData$.next();
}

  addReview(item: OrderContent) {
    this.mode = 'add-review';
    this.modal.addReview(item);
  }

  buyProduct(_t15: OrderContent) {
    throw new Error('Method not implemented.');
  }

  cancelOrder(order_id: string) {
    this.mode = 'cancel-order';
    this.modal.cancelOrder(order_id);
  }

  returnOrder(order_id: string) {
    this.mode = 'return-order';
    this.modal.returnOrder(order_id);
  }

  returnOrderInitiate(params: {id: string, reason: string}){
    console.log('return req')
    let formData: any = new FormData();
    formData.append('order_id', params.id);
    formData.append('reason', params.reason);

    this.orderService.patchReturnOrderInitiate(formData).subscribe({
      next: (response: any) => {
        this.toaster.showToast('Success!', 'Your return request has been placed.', 'default');
        this.orderStatusMode = 'return';
        this.orderDetails = this.orderService.getOrderDetail(this.orderId).pipe(map((response: any) => formatOrderDetails(response)));
      },
      error: (err: any) => {
        this.toaster.showToast('Oops!', err.error.message, 'negative');
      }
    })
    
  }

  cancelOrderConfirm(params: {id: string, reason: string}){
    console.log('cancel req')
    let formData: any = new FormData();
    formData.append('order_id', params.id);
    formData.append('reason', params.reason);
    
    this.orderService.postCancelOrder(formData).subscribe({
      next: (response: any) => {
        this.toaster.showToast('Success!', 'Your order has been cancelled.', 'default');
        this.orderStatusMode = 'cancel';
        this.orderDetails = this.orderService.getOrderDetail(this.orderId).pipe(map((response: any) => formatOrderDetails(response)));
      },
      error: (err: any) => {
        this.toaster.showToast('Oops!', err.error.message, 'negative');
      }
    })
  }
  
  toast(data: string[]): void {
    this.toaster.showToast(data[0], data[1], data[2]);
  }

  chat(id: string){
    console.log(id)
    this.router.navigate(['/profile/orders/details/chats', id]);
  }

  refreshReviews(): void {
    this.orderDetails = this.orderService.getOrderDetail(this.orderId).pipe(map((response: any) => formatOrderDetails(response)));
    this.orderDetails.subscribe((orders: OrderDetail[]) => {
      orders[0].order_contents.forEach((item: OrderContent) => {
        this.orderSubtotal += this.Number(item.sub_price)
      })
       if(orders[0].status == 15 || orders[0].status == 10 || orders[0].status == 51){
        this.orderStatusMode = 'cancel';
      }
      else if(orders[0].status == 300 || orders[0].status == 310 || orders[0].status == 320 || orders[0].status == 330){
        this.orderStatusMode = 'return'
      }
      else {
        this.orderStatusMode = 'default';
      }
    }) 
  }

  triggerUploadShipping(order_id: string): void {
    this.mode = 'upload-shipping-proof';
    this.modal.uploadShippingProof(order_id);
  }

  shippingProofUpload(params: {id: string, file: File}) {
    console.log('order id', params.id)
    let formData: any = new FormData();
    formData.append('order_id', params.id);
    formData.append('proofs[]', params.file);
    
    this.orderService.postShippingProof(formData).subscribe({
      next: (response: any) => {
        this.toaster.showToast('Success!', 'Your shipping proof has been uploaded.', 'default');
        this.orderStatusMode = 'return';
        this.orderDetails = this.orderService.getOrderDetail(this.orderId).pipe(map((response: any) => formatOrderDetails(response)));
      },
      error: (err: any) => {
        this.toaster.showToast('Oops!', this.eh.handle(err), 'negative');
      }
    })
  }
} 
