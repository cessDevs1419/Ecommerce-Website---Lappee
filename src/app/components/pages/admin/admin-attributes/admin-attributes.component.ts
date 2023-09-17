import { Component } from '@angular/core';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
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
	
	
  selectedRowData: any;
  selectedRowDataForDelete: any;
  attributes!: Observable<AdminCategory[]>;

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

}
