import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersComponent } from '../../orders/orders.component';
import { OrderService } from 'src/app/services/order/order.service';
import { Order } from 'src/assets/models/products';
import { OrderContent, OrderDetail, OrderList } from 'src/assets/models/order-details';
import { formatOrderDetails } from 'src/app/utilities/response-utils';
import { Observable, map } from 'rxjs';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {

  Number = Number;
  constructor (private http: HttpClient, private route: ActivatedRoute, private orderService: OrderService) {
    this.orderId = String(this.route.snapshot.paramMap.get('orderId'))
  }

  mode: string;
  orderId: string = "";
  orderDetails: Observable<OrderDetail[]>;
  orderSubtotal: number = 0;
  @ViewChild(ModalClientComponent) modal: ModalClientComponent;

  ngOnInit(): void {
    this.orderDetails = this.orderService.getOrderDetail(this.orderId).pipe(map((response: any) => formatOrderDetails(response)));
    this.orderDetails.subscribe((orders: OrderDetail[]) => {
      orders[0].order_contents.forEach((item: OrderContent) => {
        this.orderSubtotal += this.Number(item.sub_price)
      })
    }) 
  }



  addReview(item: OrderContent) {
    this.mode = 'add-review';
    this.modal.addReview(item);
  }
  buyProduct(_t15: OrderContent) {
    throw new Error('Method not implemented.');
  }
} 
