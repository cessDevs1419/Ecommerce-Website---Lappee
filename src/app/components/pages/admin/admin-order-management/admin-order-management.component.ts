
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Observable, Subject, map, of, startWith, switchMap, tap } from 'rxjs';
import { ModalComponent } from 'src/app/components/components/modal/modal.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { EchoService } from 'src/app/services/echo/echo.service';
import { OrderService } from 'src/app/services/order/order.service';
import { formatAdminOrder, formatAdminOrderDetail } from 'src/app/utilities/response-utils';
import { AdminOrder, AdminOrderContent, AdminOrderDetail, AdminOrderDetailList } from 'src/assets/models/order-details';
import { Order } from 'src/assets/models/products';

@Component({
    selector: 'app-admin-order-management',
    templateUrl: './admin-order-management.component.html',
    styleUrls: ['./admin-order-management.component.css']
})
export class AdminOrderManagementComponent {
    

    @ViewChild(ToasterComponent) toaster: ToasterComponent;
    @ViewChild(TableComponent) table: TableComponent;
    @ViewChild(ModalComponent) modal: ModalComponent;
    backdrop: string = 'true';
    toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  

    orders!: Observable<AdminOrder[]>;
	ordersDetails$!: Observable<any>;
    ordersContents$: Observable<AdminOrderContent[]>;

    
    paymentStatus: number = 50;
    packStatus: number = 100; 
	shipStatus: number = 150;
	deliverStatus: number = 175; 

	private refreshData$ = new Subject<void>();
    selectedRowData!: any;
    
    constructor(
        private echo: EchoService, 
		private service: OrderService,
		private cdr: ChangeDetectorRef
	) {}
	
	ngOnInit(): void{
		this.orders = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.service.getAdminOrdersPending()),
            map((Response: any) => formatAdminOrder(Response))            ,
            tap(() => {
                this.table.loaded()
            })
        );
        
        this.echo.listen('admin.notifications.orders', 'OrderStatusAlert', (data: any) => {
            this.refreshTableData();
        })

          this.echo.listen('admin.notifications.orders.placed', 'OrderPlaced', (data: any) => {
            this.refreshTableData();
          })
          this.echo.listen('admin.notifications.orders.cancelled', 'OrderCancelled', (data: any) => {
            this.refreshTableData();
          })
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
                this.ordersDetails$ = of(data); 
            },
            error: (error: HttpErrorResponse) => {
                console.log(error);
            }
        }); 
        
    }
        
    getDate(event: any){
        console.log(event)
    }
    
    getStatus(event: any){
        console.log(event)
    }
    
    SuccessToast(value: any): void {
        this.toaster.showToast(value.head, value.sub, 'default', '', )
    }
    
    WarningToast(value: any): void {
        this.toaster.showToast(value.head, value.sub, 'warn', '', )
    }
    
    ErrorToast(value: any): void {
        this.toaster.showToast(value.head, value.sub, 'negative', '', )
    }
    

    
}
