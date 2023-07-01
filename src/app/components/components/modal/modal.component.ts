import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CategoryList, Category } from 'src/assets/models/categories';
import { map } from 'rxjs';

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
    
    @Input() modalAdminDashboard!: boolean;
    @Input() modalCourierDashboard!: boolean;

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
    
    
    
    @Input() selectedRowData: any;
    @ViewChild('LappeeForm') LappeeForm!: NgForm;
    
    //SET DATA

    
    categories!: Observable<Category[]>;

    constructor(private service: CategoriesService) {}

    ngOnInit(): void {
        this.categories = this.service.getCategories().pipe(
            map((response: CategoryList) => this.formatCategories(response))
        );
    }

    private formatCategories(response: CategoryList): Category[] {
        return response.data.map((data: Category) => ({
            id: data.id,
            name: data.name
        }));
    } 
	
    
    //GET CATEGORY DATA
    categoryData = {
        main_category: '',
    }
    
    subcategoryData = {
        main_category: '',
        sub_categories: [] as Subcategory[]
    };
    
    
    addInput() {
        const newId = (this.subcategoryData.sub_categories.length + 1).toString();
        const newSubCategory: Subcategory = {
            main_category: this.subcategoryData.main_category,
            sub_category: ''
        };
        this.subcategoryData.sub_categories.push(newSubCategory);
    }
    
    //GET PRODUCT DATA
    productData = {
        product_name: '',
        product_quantity: null,
        product_price: null,
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
        console.log(this.categoryData);
        console.log(this.subcategoryData);
        //this.LappeeForm.reset();
    }
}
