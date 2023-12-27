import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgZone, Output, ViewChild } from '@angular/core';
import { Observable, Subject, catchError, map, startWith, switchMap, tap } from 'rxjs';
import { ModalComponent } from 'src/app/components/components/modal/modal.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AttributesService } from 'src/app/services/attributes/attributes.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { formatAdminCategories, formatAttributes, formatAttributesDetails } from 'src/app/utilities/response-utils';
import { AttributesDetails } from 'src/assets/models/attributes';
import { AdminCategory } from 'src/assets/models/categories';

@Component({
  selector: 'app-admin-attributes',
  templateUrl: './admin-attributes.component.html',
  styleUrls: ['./admin-attributes.component.css']
})
export class AdminAttributesComponent {
	
	@ViewChild(ToastComponent) toast: ToastComponent;
	@ViewChild(ToasterComponent) toaster: ToasterComponent;
  @ViewChild(TableComponent) table: TableComponent;
	@ViewChild('triggerFunction') childComponent: TableComponent;
  showMinus: boolean = false
  @ViewChild(ModalComponent) modal: ModalComponent;
  selectedRowData: any;
  selectedRowDataForDelete: any;
  attributes!: Observable<AdminCategory[]>;
  attributesDetail!: Observable<AttributesDetails>;
  attributesDetails: any[] = [];

  backdrop: string = 'true';
	toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default";  

  private refreshData$ = new Subject<void>();
  
  constructor(
      private zone: NgZone,
		  private attribute_service: AttributesService,
	) {
    
	}
	
  ngOnInit(): void{
    
    this.attributes = this.refreshData$.pipe(
        startWith(undefined), 
        switchMap(() => this.attribute_service.getAttribute()),
        map((Response: any) => formatAttributes(Response)),
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
  this.attributesDetail = this.attribute_service.getAttributeDetails(rowData.id)
  .pipe(
    map((response: any) => response.data),
    catchError((error: HttpErrorResponse) => {
      console.log(error);
      // Handle the error if needed
      return [];
    })
  );


  this.attribute_service.getAttributeDetails(rowData.id).subscribe(data => {
    this.zone.run(() => {
      this.modal.reset()
      for(const items of data.data.values){
        this.modal.loadAttributeData(items)
      }

    });
  });
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
