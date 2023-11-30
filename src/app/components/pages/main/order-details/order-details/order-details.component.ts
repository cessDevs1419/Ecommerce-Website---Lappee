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

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {


  Number = Number;
  constructor (private http: HttpClient, private route: ActivatedRoute, private orderService: OrderService, private accountService: AccountsService, private router: Router) {
    this.orderId = String(this.route.snapshot.paramMap.get('orderId'))
  }

  user: Observable<User> = this.accountService.getLoggedUser();
  mode: string;
  orderId: string = "";
  orderDetails: Observable<OrderDetail[]>;
  orders!: Observable<AdminOrder[]>;

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
        this.isCancelRequest = true;
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

  cancelOrderConfirm(params: {id: string, reason: string}){
    let formData: any = new FormData();
    formData.append('order_id', params.id);
    formData.append('reason', params.reason);
    
    this.orderService.postCancelOrder(formData).subscribe({
      next: (response: any) => {
        this.toaster.showToast('Success!', 'Your order has been cancelled.', 'default');
        this.isCancelRequest = true;
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
        this.isCancelRequest = true;
      }
    }) 
  }
} 
