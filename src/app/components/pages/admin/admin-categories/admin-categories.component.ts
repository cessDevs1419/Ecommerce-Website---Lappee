import { Component } from '@angular/core';


import { Observable } from 'rxjs';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';

import { Subcategory, SubcategoryList } from 'src/assets/models/subcategories';
import { Category, CategoryList } from 'src/assets/models/categories';

import { map } from 'rxjs';

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
		private subcategory_service: SubcategoriesService
	) {}
	
	ngOnInit(): void{
		this.categories = this.category_service.getCategories().pipe(map((Response: any) => this.formatCategories(Response)));
    this.sub_categories = this.subcategory_service.getSubcategories().pipe(map((Response: any) => this.formatSubcategories(Response)));
	}
	
	private formatCategories(Response: CategoryList) : Category[]{
		return Response.data.map((data: Category) => ({
	        id: data.id,
	        name: data.name,
		}))
	}
	private formatSubcategories(Response: SubcategoryList) : Subcategory[]{
		return Response.data.map((data: Subcategory) => ({
	        id: data.id,
	        main_category: data.main_category,
	        name: data.name,
		}))
	}

	
  /*Needed for table to send data to modal*/
	selectedRowData: any;

  onRowDataSelected(rowData: any) {
      this.selectedRowData = rowData;
  }
  
  

  
  size = "w-100"
  
  
}
