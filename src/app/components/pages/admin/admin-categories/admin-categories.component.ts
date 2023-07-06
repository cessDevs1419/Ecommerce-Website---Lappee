import { Component } from '@angular/core';


import { Observable } from 'rxjs';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';

import { Category, CategoryList, Subcategory } from 'src/assets/models/categories';

import { map } from 'rxjs';

import { formatCategories, formatSubcategories } from 'src/app/utilities/response-utils';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent {


    /*SET DATA*/
    categories!: Observable<Category[]>;
    sub_categories!: Observable<Subcategory[]>;
  
	constructor(
		private category_service: CategoriesService,
	) {}
	
	ngOnInit(): void{
		this.categories = this.category_service.getCategories().pipe(map((Response: any) => formatCategories(Response)));
    	this.sub_categories = this.category_service.getCategories().pipe(map((Response: any) => formatSubcategories(Response)));
	}

	
/*Needed for table to send data to modal*/
	selectedRowData: any;

    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
    }



	size = "w-100"


}
