import { HttpErrorResponse } from '@angular/common/http';
import { Component, Output, ViewChild } from '@angular/core';
import { Observable, Subject, map, of, startWith, switchMap, tap } from 'rxjs';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AttributesService } from 'src/app/services/attributes/attributes.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { RestocksService } from 'src/app/services/restock/restocks.service';
import { formatAdminCategories, formatAttributes, formatRestockList, formatRestockProductView } from 'src/app/utilities/response-utils';
import { AdminCategory } from 'src/assets/models/categories';
import { Restock, RestockView } from 'src/assets/models/restock';

@Component({
  selector: 'app-admin-stocks-management',
  templateUrl: './admin-stocks-management.component.html',
  styleUrls: ['./admin-stocks-management.component.css']
})
export class AdminStocksManagementComponent {
		
	@ViewChild(ToastComponent) toast: ToastComponent;
	@ViewChild(ToasterComponent) toaster: ToasterComponent;
  @ViewChild(TableComponent) table: TableComponent;
	@ViewChild('triggerFunction') childComponent: TableComponent;
  showMinus: boolean = false

  selectedRowData: any;
  selectedRowDataForDelete: any;
  stocks!: Observable<Restock[]>;
  stockView: Observable<RestockView>;

  titleColor: string = 'color-adm-light-gray';
  textColor: string = 'text-secondary';
  borderColor: string = '';
  backGround: string = '';
  btncolor: string = 'btn-primary glow-primary'
  size: string = 'w-100';

  backdrop: string = 'true';
	toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default";  

  paymentStatus: number = 50;
  packStatus: number = 100; 
  shipStatus: number = 150;
  deliverStatus: number = 175; 
  date: string = ''; 
  private refreshData$ = new Subject<void>();
  
  constructor(
		  private attribute_service: AttributesService,
      private retocks: RestocksService
	) {
    
	}
	
  ngOnInit(): void{
    
    this.stocks = this.refreshData$.pipe(
        startWith(undefined), 
        switchMap(() => this.retocks.getRestockList()),
        map((Response: any) => formatRestockList(Response)),
        tap(() => {
          this.table.loaded()
        })
    );



  }

refreshTableData(): void {
  this.refreshData$.next();
}
onRowDataForDelete(rowData: any){
  this.selectedRowDataForDelete = rowData; 
}
onRowDataSelected(rowData: any) {
  this.selectedRowData = rowData;
  this.stockView = this.retocks.getRestockListView(rowData.restock_id).pipe(map((Response: any) => formatRestockProductView(Response)));
  this.stockView.subscribe(data => {
    this.date = data.details.date
  })
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
