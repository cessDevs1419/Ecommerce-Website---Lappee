import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { Observable, Subject, combineLatest, startWith, switchMap } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { AdminProduct, Product, ProductList } from 'src/assets/models/products';
import { formatAdminProducts, formatAdminSubcategories, formatProducts } from 'src/app/utilities/response-utils';
import { map } from 'rxjs';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';

@Component({
    selector: 'app-admin-products',
    templateUrl: './admin-products.component.html',
    styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent {

    @ViewChild(ToastComponent) toast: ToastComponent;

    products!: Observable<AdminProduct[]>;
    sub_categories: Observable<AdminSubcategory[]>;
	private refreshData$ = new Subject<void>();

    selectedRowData: any;
    /*classes*/
	margin = "mx-lg-2"
	size = "w-100 me-2"
    
    //theme


    backdrop: string = 'true';
    toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  
    counter_bg: string = 'table-bg-dark'
    counter_heading_text_color: string = 'dark-theme-heading-text-color'
    text_color: string = 'dark-theme-text-color'
	constructor(
		private service: ProductsService,
		private subcategory_service: SubcategoriesService,
		private router: Router
	) {}
	
	ngOnInit(): void{
		this.products = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.service.getAdminProducts()),
            map((Response: any) => formatAdminProducts(Response))
        );
	}
	
    refreshTableData(): void {
        this.refreshData$.next();
    }

    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
        
    }
    
	
    showAddForm(): void{
        this.router.navigate(['/admin/product-management','product','add']);
	}
	
    showEditForm(): void{
        
        this.router.navigate(['/admin/product-management','product','edit',this.selectedRowData.id]);
	}
	
	SuccessToast(value: any): void {
        this.toastHeader = value.head;
        this.toastContent = value.sub;
        this.toast.switchTheme('default');
        this.toast.show();
    }
    
    WarningToast(value: any): void {
        this.toastHeader = value.errorMessage;
        this.toastContent = value.suberrorMessage;
        this.toast.switchTheme('warn');
        this.toast.show();
    }
    
    ErrorToast(value: any): void {
        this.toastHeader = value.errorMessage;
        this.toastContent = value.suberrorMessage;
        this.toast.switchTheme('negative');
        this.toast.show();
    }
	

	

}
