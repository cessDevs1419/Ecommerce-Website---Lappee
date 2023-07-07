import { Component } from '@angular/core';


import { Observable } from 'rxjs';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';

import { Category, CategoryList, Subcategory, AdminCategory } from 'src/assets/models/categories';

import { map } from 'rxjs';

import { formatAdminCategories, formatAdminSubcategories } from 'src/app/utilities/response-utils';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent {


    /*SET DATA*/
    categories!: Observable<AdminCategory[]>;
    sub_categories!: Observable<Subcategory[]>;
  
	constructor(
		private category_service: CategoriesService,
        private subcategory_service: SubcategoriesService
	) {}
	
	ngOnInit(): void{
		this.categories = this.category_service.getAdminCategories().pipe(map((Response: any) => formatAdminCategories(Response)));
    	this.sub_categories = this.subcategory_service.getAdminSubcategories().pipe(map((Response: any) => formatAdminSubcategories(Response)));
	}

	
/*Needed for table to send data to modal*/
	selectedRowData: any;

    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
    }



	size = "w-100"


}
