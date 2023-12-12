import { Component, ViewChild } from '@angular/core';
import { Observable, Subject, BehaviorSubject, startWith, switchMap, map, tap } from 'rxjs';
import { ChatsComponent } from 'src/app/components/components/chats/chats.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { ShippingService } from 'src/app/services/shipping/shipping.service';
import { UsersService } from 'src/app/services/users/users.service';
import { formatBannedUser, formatShippingFee, formatUser } from 'src/app/utilities/response-utils';
import { ShippingFee } from 'src/assets/models/shipping';
import { User, BannedUser } from 'src/assets/models/user';

@Component({
  selector: 'app-admin-shipping-fee',
  templateUrl: './admin-shipping-fee.component.html',
  styleUrls: ['./admin-shipping-fee.component.css']
})
export class AdminShippingFeeComponent {
  @ViewChild(ToastComponent) toast: ToastComponent;
    @ViewChild(ToasterComponent) toaster: ToasterComponent;
    @ViewChild(TableComponent) table: TableComponent;
    @ViewChild(ChatsComponent) chats: ChatsComponent;
    backdrop: string = 'true';
    toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  
    
    shippingFees!: Observable<ShippingFee[]>;
    private refreshData$ = new Subject<void>();
    
    modalTitle: string;
    modalBanAccounts: boolean;
    modalUnBanAccounts: boolean;
	constructor(private user_service: UsersService, private shippingFeeService: ShippingService) {}
	
	ngOnInit(): void{
        this.shippingFees = this.refreshData$.pipe(
            startWith(undefined),
            switchMap(() => this.shippingFeeService.getAdminShippingFeeList()),
            map((response: any) => formatShippingFee(response)),
            tap(() => {
                this.table.loaded()
            })
        );
	}
	
    refreshTableData(): void {
        this.refreshData$.next();
    }
    
    selectedRowData: any;
    
    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;

        // Update modalBanAccounts, modalUnBanAccounts, and modalTitle when rowData is available
        // if (this.bannedStatus[this.selectedRowData.user_id]) {
        //     this.modalTitle = "Unban Account";
        // } else {
        //     this.modalTitle = "Ban Account";
        // }
        // this.modalBanAccounts = !this.bannedStatus[this.selectedRowData.user_id];
        // this.modalUnBanAccounts = this.bannedStatus[this.selectedRowData.user_id];
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
