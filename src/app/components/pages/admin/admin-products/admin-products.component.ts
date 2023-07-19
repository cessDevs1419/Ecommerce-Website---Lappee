import { Component } from '@angular/core';

import { Observable, Subject, startWith, switchMap } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { Product, ProductList } from 'src/assets/models/products';
import { formatProducts } from 'src/app/utilities/response-utils';
import { map } from 'rxjs';

@Component({
    selector: 'app-admin-products',
    templateUrl: './admin-products.component.html',
    styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent {

    products!: Observable<Product[]>;
	private refreshData$ = new Subject<void>();
	
	constructor(
		private service: ProductsService,
	) {}
	
	ngOnInit(): void{
		
		this.products = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.service.getAdminProducts()),
            map((Response: any) => formatProducts(Response))
        );
	}
	
    refreshTableData(): void {
        this.refreshData$.next();
    }

	selectedRowData: any;

    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
    }
    
	/*classes*/
	margin = "mx-lg-2"
	size = "w-100"
	

}
