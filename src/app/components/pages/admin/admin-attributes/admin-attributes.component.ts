import { Component, Output, ViewChild } from '@angular/core';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { AttributesService } from 'src/app/services/attributes/attributes.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { formatAdminCategories, formatAttributes } from 'src/app/utilities/response-utils';
import { AdminCategory } from 'src/assets/models/categories';

@Component({
  selector: 'app-admin-attributes',
  templateUrl: './admin-attributes.component.html',
  styleUrls: ['./admin-attributes.component.css']
})
export class AdminAttributesComponent {
	
	@ViewChild(ToastComponent) toast: ToastComponent;
	@ViewChild('triggerFunction') childComponent: TableComponent;
  showMinus: boolean = false

  selectedRowData: any;
  selectedRowDataForDelete: any;
  attributes!: Observable<AdminCategory[]>;

  backdrop: string = 'true';
	toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default";  

  private refreshData$ = new Subject<void>();
  
  constructor(
		  private attribute_service: AttributesService,
	) {
    
	}
	
  ngOnInit(): void{
    
    this.attributes = this.refreshData$.pipe(
        startWith(undefined), 
        switchMap(() => this.attribute_service.getAttribute()),
        map((Response: any) => formatAttributes(Response))
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
}

showMinusFunction(){
  this.childComponent.removeAllSelected();
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
