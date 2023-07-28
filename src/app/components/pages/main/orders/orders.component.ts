import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';
import { formatOrderDetails } from 'src/app/utilities/response-utils';
import { OrderContent, OrderDetail, OrderList } from 'src/assets/models/order-details';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  Number = Number;
  userOrders!: Observable<OrderDetail[]>;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.userOrders = this.orderService.getOrderDetailByUser().pipe(map((response: any) => formatOrderDetails(response)));
  }

  calculateOrderPrice(order: OrderDetail): number {
    let total: number = 0
    order.order_contents.forEach((item: OrderContent) => {
      total += Number(item.sub_price)
    });
    return total;
  }
}
