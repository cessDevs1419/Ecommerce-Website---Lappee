import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Observable, map } from 'rxjs';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { formatOrderDetails, orderSortByDate } from 'src/app/utilities/response-utils';
import { OrderContent, OrderDetail, OrderList } from 'src/assets/models/order-details';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  Number = Number;
  mode: string;
  orders: Observable<OrderDetail[]>;
  userOrders!: Observable<OrderDetail[]>;
  userOrdersArr: OrderDetail[];
  isLoading: boolean = true;
  doneLoading: boolean = false;
  @ViewChild(ModalClientComponent) modal: ModalClientComponent;

  searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl('')
  })

  get searchTerm() { return this.searchForm.get('searchTerm') }

  searchResults: OrderDetail[] = [];

  constructor(private orderService: OrderService,
              private cartService: CartService) {}

  ngOnInit(): void {
    this.orders = this.orderService.getOrderDetailByUser().pipe(map((response: any) => formatOrderDetails(response)));
    this.userOrders = orderSortByDate(this.orders, 'descending');
    this.userOrders.subscribe((order: OrderDetail[]) => {
      this.userOrdersArr = order;
      this.isLoading = false;
      this.doneLoading = true;
      this.searchOrder();
    })
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

  searchOrder(): void {
    let term = this.searchForm.get('searchTerm')?.value;
    this.searchResults = this.search(term);
  }

  search(term: string): OrderDetail[] {
    const lowerCasedSearchTerm = term.toLowerCase();

    return this.userOrdersArr.filter((orderDetail: OrderDetail) => {
      const orderIDLowerCase = orderDetail.order_id.toLowerCase();
      const nameFound = orderDetail.order_contents.some((content) =>
        content.name.toLowerCase().includes(lowerCasedSearchTerm)
      );

      return orderIDLowerCase.includes(lowerCasedSearchTerm) || nameFound;
    });
  }
}
