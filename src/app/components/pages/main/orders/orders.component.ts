import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Observable, map } from 'rxjs';
import { OrderHistoryLoaderComponent } from 'src/app/components/components/loader/main/order-history-loader/order-history-loader.component';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { formatOrderDetails, formatProducts, orderSortByDate } from 'src/app/utilities/response-utils';
import { OrderContent, OrderDetail, OrderList } from 'src/assets/models/order-details';
import { Product } from 'src/assets/models/products';

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
  products!: Observable<Product[]>;
  productsArr!: Product[];
  isLoading: boolean = true;
  doneLoading: boolean = false;
  @ViewChild(ModalClientComponent) modal: ModalClientComponent;

  searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl('')
  })

  get searchTerm() { return this.searchForm.get('searchTerm') }

  searchResults: OrderDetail[] = [];

  orderLoader = OrderHistoryLoaderComponent;

  //pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private orderService: OrderService,
              private cartService: CartService,
              private productService: ProductsService) {}

  ngOnInit(): void {
    this.orders = this.orderService.getOrderDetailByUser().pipe(map((response: any) => formatOrderDetails(response)));
    this.products = this.productService.getProducts().pipe(map((response: any) => formatProducts(response)));
    this.userOrders = orderSortByDate(this.orders, 'descending');
    this.userOrders.subscribe((order: OrderDetail[]) => {
      this.products.subscribe((product: Product[]) => {
        this.productsArr = product;
        this.userOrdersArr = order;
        this.isLoading = false;
        this.doneLoading = true;
        this.searchOrder();
        console.log(this.productsArr);
      })
    })
  }

  /*
  checkProductStock(product_id: string, variant_color: string, variant_size: string): boolean {
      // match id
      if(this.productsArr.filter(product => product.id === product_id).length > 0){
        let matchProduct = this.productsArr.filter(product => product.id === product_id);
        // match variant color and size
        if((matchProduct[0].variants.filter(variant => variant.color_title === variant_color).length > 0) && (matchProduct[0].variants.filter(variant => variant.size === variant_size).length > 0)) {
          return true;
        }
      }
      return false;
  }
  */

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

  paginateReview(): OrderDetail[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.searchResults.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }
}
