import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersComponent } from '../../orders/orders.component';
import { OrderService } from 'src/app/services/order/order.service';
import { Order } from 'src/assets/models/products';
import { OrderContent, OrderDetail, OrderList } from 'src/assets/models/order-details';
import { formatOrderDetails } from 'src/app/utilities/response-utils';
import { Observable, map } from 'rxjs';

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

  orderId: string = ""
  orderDetails: Observable<OrderDetail[]>;

  ngOnInit(): void {
    this.orderDetails = this.orderService.getOrderDetail(this.orderId).pipe(map((response: any) => formatOrderDetails(response)))
    
  }

  addReview(_t15: OrderContent) {
    throw new Error('Method not implemented.');
    }
  buyProduct(_t15: OrderContent) {
    throw new Error('Method not implemented.');
  }
} 
