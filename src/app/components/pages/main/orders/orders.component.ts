import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Observable, map } from 'rxjs';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';
import { CartService } from 'src/app/services/cart/cart.service';
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
  mode: string;
  userOrders!: Observable<OrderDetail[]>;
  @ViewChild(ModalClientComponent) modal: ModalClientComponent;

  constructor(private orderService: OrderService,
              private cartService: CartService) {}

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

  buyProduct(item: OrderContent): void {

  }

  addReview(item: OrderContent): void {
    this.mode = 'add-review';
    this.modal.addReview(item);
  }
}
