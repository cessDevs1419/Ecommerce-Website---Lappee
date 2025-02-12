
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Output, ViewChild } from '@angular/core';
import { Observable, Subject, concatMap, from, map, startWith, switchMap, tap } from 'rxjs';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AttributesService } from 'src/app/services/attributes/attributes.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductGroupService } from 'src/app/services/product-group/product-group.service';
import { formatAdminCategories, formatAttributes, formatProductGroup } from 'src/app/utilities/response-utils';
import { AdminCategory } from 'src/assets/models/categories';
import { NewProductGroup, ProductGroup, ProductGroupList } from 'src/assets/models/product-groups';
import { Product } from 'src/assets/models/products';

@Component({
  selector: 'app-admin-product-group',
  templateUrl: './admin-product-group.component.html',
  styleUrls: ['./admin-product-group.component.css']
})
export class AdminProductGroupComponent {

	@ViewChild(ToastComponent) toast: ToastComponent;
	@ViewChild(ToasterComponent) toaster: ToasterComponent;
  @ViewChild(TableComponent) table: TableComponent;
	@ViewChild('triggerFunction') childComponent: TableComponent;
  showMinus: boolean = false

  selectedRowData: any;
  selectedRowDataForDelete: any;
  attributes!: Observable<AdminCategory[]>;
  productGroup$!: Observable<NewProductGroup[]>;
  productGroupMain$!: Observable<ProductGroup>;
  backdrop: string = 'true';
	toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default";  

  private refreshData$ = new Subject<void>();
  
  constructor(
		  private product_group: ProductGroupService,
	) {
    
	}
	
  ngOnInit(): void{
    
    // this.productGroupMain$ = this.refreshData$.pipe(
    //     startWith(undefined), 
    //     switchMap(() => this.product_group.getAdminProductGroup()),
    //     map((Response: any) => formatProductGroup(Response)),
    //     tap(() => {
    //       this.table.loaded()
    //     })
    // );
      
    // this.productGroupMain$.subscribe(data =>{
    //   console.log(data)
    // })
    
    this.productGroup$ = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.product_group.getAdminProductGroup()),
      map((response: ProductGroupList) => formatProductGroup(response)),
      map((data: ProductGroup) => {
        const newArray: NewProductGroup[] = [];
    
        // Find the minimum length between tops and bottoms arrays
        const minLength = Math.min(data.tops.length, data.bottoms.length);
    
        // Iterate through the arrays up to the minimum length
        for (let i = 0; i < minLength; i++) {
          newArray.push({
            tops: data.tops[i],
            bottoms: data.bottoms[i]
          });
        }
    
        return newArray;
      }),
      tap(() => {
        this.table.loaded();
      })
    );
    
    this.productGroup$.subscribe(data => {
      console.log(data);
    });
    


  }

refreshTableData(): void {
  this.refreshData$.next();
}
onRowDataForDelete(rowData: any){
  this.selectedRowDataForDelete = rowData; 
}
onRowDataSelected(rowData: any) {
  this.selectedRowData = rowData;
}

showMinusFunction(){
  this.childComponent.removeAllSelected();
}



SuccessToast(value: any): void {
  this.toaster.showToast(value.head, value.sub, 'default', '', )
}

WarningToast(value: any): void {
  this.toaster.showToast(value.head, value.sub, 'warn', '', )
}

ErrorToast(value: any): void {
  this.toaster.showToast(value.head, value.sub, 'negative', '', )
}
}
