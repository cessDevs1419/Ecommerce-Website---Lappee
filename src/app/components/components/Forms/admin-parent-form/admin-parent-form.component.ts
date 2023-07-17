import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';

@Component({
    selector: 'app-admin-parent-form',
    templateUrl: './admin-parent-form.component.html',
    styleUrls: ['./admin-parent-form.component.css']
})
export class AdminParentFormComponent {
	
	@ViewChild(ToastComponent) toast: ToastComponent
	@Output() success: EventEmitter<any> = new EventEmitter();
	@Output() invalid: EventEmitter<any> = new EventEmitter();
	@Output() RefreshTable: EventEmitter<void> = new EventEmitter<void>();
	
	@Input() modalID: string;
	@Input() modalTitle!: string;
	@Input() modalSubTitle!: string;
	
	//Forms
	@Input() modalAddCategory!: boolean;
	@Input() modalAddSubCategory!: boolean;
	@Input() modalEditCategory!: boolean;
	@Input() modalDeleteCategory!: boolean;
	
	@Input() modalAddProduct!: boolean;
	@Input() modalEditProduct!: boolean;
	@Input() modalDeleteProduct!: boolean;
	@Input() modalRestockProduct!: boolean;
	
	@Input() modalAddDiscount!: boolean;
	@Input() modalEditDiscount!: boolean;  
	@Input() modalDeleteDiscount!: boolean;   
	
	//Account Forms
	@Input() modalBanAccounts!: boolean;  
	
	//Parcel Forms
	@Input() modalParcel!: boolean;
	@Input() modalAddParcel!: boolean; 
	@Input() modalEditParcel!: boolean;  
	
	//Order Forms
	@Input() modalOrder!: boolean;
	@Input() modalEditOrder!: boolean;  
	@Input() modalViewOrder!: boolean;  
	
	//Admin-Courier Forms
	@Input() modalAdminCourier!: boolean;
	@Input() modalEditCourier!: boolean;   
	
	//Courier Forms
	@Input() modalCourier!: boolean;
	@Input() modalNotifyCourier!: boolean;  
	@Input() modalCheckCourier!: boolean;  
	@Input() modalViewCourier!: boolean; 
	
	//GetSelectedRowData
	@Input() selectedRowData: any;

	
    toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default"; 
    //Toast Functions
    
    triggerRefreshTable(): void {
		this.RefreshTable.emit();
	}
	
    postSuccessToast(value: string): void {
        this.toastHeader = value;
        this.toastContent = "Successfully Added";
        this.toast.switchTheme('default');
        this.toast.show();
    }
    
	patchSuccessToast(value: string): void {
        this.toastHeader = value;
        this.toastContent = "Successfully Updated";
        this.toast.switchTheme('default');
        this.toast.show();
    }
    
	deleteSuccessToast(value: string): void {
        this.toastHeader = value;
        this.toastContent = "Successfully Deleted";
        this.toast.switchTheme('default');
        this.toast.show();
    }
    
    ErrorToast(value: any): void {
        this.toastHeader = value.errorMessage;
        this.toastContent = value.suberrorMessage;
        this.toast.switchTheme('negative');
        this.toast.show();
        console.log(this.toastTheme);
    }
}



