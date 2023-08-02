import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UsersService } from 'src/app/services/users/users.service';
import { formatOrderDetails, formatUser } from 'src/app/utilities/response-utils';
import { OrderDetail } from 'src/assets/models/order-details';
import { User } from 'src/assets/models/user';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.css']
})
export class ProfileBannerComponent {

  //user: User = this.accountService.user;
  //fullName: string = this.user.fname + " " + (this.user.mname ? this.user.mname : "") + " " + this.user.lname + " " + (this.user.suffix ? this.user.suffix : "");
  user: Observable<User> = this.accountService.getLoggedUser();
  orders: Observable<OrderDetail[]>;

  constructor(private accountService: AccountsService, private userService: UsersService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders = this.orderService.getOrderDetailByUser().pipe(map((response: any) => formatOrderDetails(response)))
  }

  /*
  users!: Observable<User[]>;
  ngOnInit(): void {
    this.users = this.userService.getUsers().pipe(map((response: any) => formatUser(response)))
  }
  */
}
