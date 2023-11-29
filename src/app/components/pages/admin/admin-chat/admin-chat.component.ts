import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, filter, map, of, startWith, switchMap, tap } from 'rxjs';
import { ChatsComponent } from 'src/app/components/components/chats/chats.component';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { EchoService } from 'src/app/services/echo/echo.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UsersService } from 'src/app/services/users/users.service';
import { formatAdminOrder, formatAdminOrderDetail, formatChats, formatChatsList, formatUser } from 'src/app/utilities/response-utils';
import { Chats, ChatsChannel } from 'src/assets/models/chats';
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
  chatList!: Observable<ChatsChannel[]>;
  selectedRowData!: any;
  orders!: Observable<AdminOrder[]>;
  ordersDetails!: Observable<AdminOrderDetail>;
  ordersContents$: Observable<AdminOrderContent[]>;
  order_id: string = ''
  chatsList!: Observable<Chats[]>;
  
  constructor(
		private user_service: UsersService,
    private service: OrderService,
    private chatsService: ChatsService,
      private route: ActivatedRoute,
    private echo: EchoService,
	) {
    
	}
  
	ngOnInit(): void{
    this.orders = this.refreshData$.pipe(
      startWith(undefined), 
      switchMap(() => this.service.getAdminOrdersHold()),
      map((Response: any) => formatAdminOrder(Response))
    );

    this.echo.listen('admin.conversation', 'NewConversation', (data: any) => {
        this.refreshTableData
      })

    this.chatList = this.refreshData$.pipe(
        startWith(undefined),
        switchMap(() => this.chatsService.getAllChats()),
        map((response: any) => formatChatsList(response)),
        tap(() => {
            this.chats.loaded()
        })
    );
    
    this.route.paramMap.subscribe((params) => {
			const id = params.get('id');
      this.order_id = id !== null ? id : ''; 
		});
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
