import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';
import { formatAdminOrder } from 'src/app/utilities/response-utils';
import { AdminOrder } from 'src/assets/models/order-details';

import { Order } from 'src/assets/models/products';

@Component({
    selector: 'app-admin-order-management',
    templateUrl: './admin-order-management.component.html',
    styleUrls: ['./admin-order-management.component.css']
})
export class AdminOrderManagementComponent {
    orders!: Observable<AdminOrder[]>;

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
    }
}
