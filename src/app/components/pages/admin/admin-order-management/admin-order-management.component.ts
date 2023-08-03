
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Observable, Subject, map, of, startWith, switchMap } from 'rxjs';
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
    
    
    orders!: Observable<AdminOrder[]>;
	ordersDetails!: Observable<AdminOrderDetail>;
    ordersContents$: Observable<AdminOrderContent[]>;
    
	private refreshData$ = new Subject<void>();
    selectedRowData!: any;
    
    constructor(
		private service: OrderService,
		private cdr: ChangeDetectorRef
	) {}
	
	ngOnInit(): void{
		this.orders = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.service.getAdminOrders()),
            map((Response: any) => formatAdminOrder(Response))
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
