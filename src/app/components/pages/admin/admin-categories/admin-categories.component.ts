import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { AdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { formatAdminCategories, formatAdminSubcategories } from 'src/app/utilities/response-utils';

@Component({
    selector: 'app-admin-categories',
    templateUrl: './admin-categories.component.html',
    styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent {

    
    
    size = "w-100"
    
    /*SET DATA*/
    categories!: Observable<AdminCategory[]>;
    sub_categories!: Observable<AdminSubcategory[]>;

	constructor(
		private category_service: CategoriesService,
        private subcategory_service: SubcategoriesService
	) {}
	
	ngOnInit(): void{
		this.categories = this.category_service.getAdminCategories().pipe(map((Response: any) => formatAdminCategories(Response)));
    	this.sub_categories = this.subcategory_service.getAdminSubcategories().pipe(map((Response: any) => formatAdminSubcategories(Response)));
	}
	
	// refreshTableData(): void {
    //     this.categories = this.category_service.getAdminCategories().pipe(map((Response: any) => formatAdminCategories(Response)));
    //     this.sub_categories = this.subcategory_service.getAdminSubcategories().pipe(map((Response: any) => formatAdminSubcategories(Response)));
    //     console.log('nagana')
    // }

	
    /*Needed for table to send data to modal*/
    selectedRowData: any;
    
    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
    }




}
