import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

    //Category Forms
    @Input() modalCategory!: boolean;
	@Input() modalAddCategory!: boolean;
    @Input() modalEditCategory!: boolean;
    @Input() modalDeleteCategory!: boolean;
    @Input() modalAddSubCategory!: boolean;

    //Product Forms
    @Input() modalProduct!: boolean;
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
    
    @Input() selectedRowData: any;
    
    //CATEGORY DATA
    
    
    //PRODUCT DATA
    productData = {
        product_name: '',
        product_quantity: 0,
        product_price: 0,
        product_currency: '',
        product_category: '',
        product_description: '',
        product_images:[] as File[]
    };
    
    selectFile() {
        const fileInput = document.getElementById('images');
        fileInput?.click();
    }
    
    handleFileInput(event: any) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            this.productData.product_images.push(files[i]);
        }
    }
    
    removeImage(index: number) {
        this.productData.product_images.splice(index, 1);
    }
    
    submitForm() {
        console.log(this.productData);
    }
}
