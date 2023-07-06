import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CategoryList, Category } from 'src/assets/models/categories';

import { Observable } from 'rxjs';

import { map } from 'rxjs';
import { formatCategories } from 'src/app/utilities/response-utils';

interface Subcategory {
    main_category: string,
    sub_category: string
}

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})



export class ModalComponent {
	//modal use
    @Input() modalID: string;
    @Input() modalTitle!: string;
    @Input() modalSubTitle!: string;

    //Forms
    @Input() modalAddCategory!: boolean;
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
