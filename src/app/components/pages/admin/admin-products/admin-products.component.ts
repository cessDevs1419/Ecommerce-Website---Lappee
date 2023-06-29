import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { Product, ProductList } from 'src/assets/models/products';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent {
  
  products!: Observable<Product[]>;

	constructor(
		private service: ProductsService,
	) {}
	
	ngOnInit(): void{
		this.products = this.service.getProducts().pipe(map((Response: any) => this.formatProducts(Response)));
	}
	
	private formatProducts(Response: ProductList) : Product[]{
		return Response.data.map((data: Product) => ({
      id: data.id,
      name: data.name,
      stock: data.stock,
      stock_limit: data.stock_limit,
      price: data.price,
      sub_category_id: data.sub_category_id,
      description: data.description
		}))
	}   
	
	/*Needed for table to send data to modal*/
	selectedRowData: any;

    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
    }
    
	/*classes*/
	margin = "mx-lg-2"
	size = "w-100"
	

}
