import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Observable, Subject, map, of, startWith, switchMap, tap } from 'rxjs';
import { ChatsComponent } from 'src/app/components/components/chats/chats.component';
import { OrderService } from 'src/app/services/order/order.service';
import { UsersService } from 'src/app/services/users/users.service';
import { formatAdminOrder, formatAdminOrderDetail, formatUser } from 'src/app/utilities/response-utils';
import { AdminOrder, AdminOrderContent, AdminOrderDetail } from 'src/assets/models/order-details';
import { User } from 'src/assets/models/user';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css']
})
export class AdminChatComponent {

  @ViewChild(ChatsComponent) chats: ChatsComponent;
  private refreshData$ = new Subject<void>();
  users!: Observable<User[]>;
  selectedRowData!: any;
  orders!: Observable<AdminOrder[]>;
  ordersDetails!: Observable<AdminOrderDetail>;
  ordersContents$: Observable<AdminOrderContent[]>;

  
  constructor(
		private user_service: UsersService,
    private service: OrderService,
	) {
    
	}
  
	ngOnInit(): void{
    this.orders = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.service.getAdminOrdersHold()),
      map((Response: any) => formatAdminOrder(Response))
    );

    this.users = this.refreshData$.pipe(
        startWith(undefined),
        switchMap(() => this.user_service.getUsers()),
        map((response: any) => formatUser(response)),
        tap(() => {
            this.chats.loaded()
        })
    );
  }

  refreshTableData(): void {
    this.refreshData$.next();
  }

  onRowDataSelected(rowData: any) {
    this.selectedRowData = rowData;
    this.service.getAdminOrderDetail(this.selectedRowData.id).subscribe({
        next: (response: any) => {
            const data = formatAdminOrderDetail(response);
            this.ordersContents$ = of(data.order_contents); 
        },
        error: (error: HttpErrorResponse) => {
            console.log(error);
        }
    }); 
  }

}
