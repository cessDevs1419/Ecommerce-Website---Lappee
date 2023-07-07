import { Component, Input} from '@angular/core';


@Component({
    selector: 'app-admin-parent-form',
    templateUrl: './admin-parent-form.component.html',
    styleUrls: ['./admin-parent-form.component.css']
})
export class AdminParentFormComponent {
	//modal use
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
	
	
	
	//Discount Forms
	@Input() modalDiscount!: boolean;
	@Input() modalAddDiscount!: boolean;
	@Input() modalEditDiscount!: boolean;  
	@Input() modalDeleteDiscount!: boolean;   
	
	//Account Forms
	@Input() modalAccounts!: boolean;
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
}



