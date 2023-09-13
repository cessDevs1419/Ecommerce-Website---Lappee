import { Component } from '@angular/core';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { formatAdminCategories } from 'src/app/utilities/response-utils';
import { AdminCategory } from 'src/assets/models/categories';

@Component({
  selector: 'app-admin-attributes',
  templateUrl: './admin-attributes.component.html',
  styleUrls: ['./admin-attributes.component.css']
})
export class AdminAttributesComponent {
	
	
  selectedRowData: any;
  categories!: Observable<AdminCategory[]>;

  private refreshData$ = new Subject<void>();
  
  constructor(
		  private category_service: CategoriesService,
	) {
    
	}
	
  ngOnInit(): void{
    
    this.categories = this.refreshData$.pipe(
        startWith(undefined), 
        switchMap(() => this.category_service.getAdminCategories()),
        map((Response: any) => formatAdminCategories(Response))
    );
    
  }

refreshTableData(): void {
  this.refreshData$.next();
}

onRowDataSelected(rowData: any) {
  this.selectedRowData = rowData;

}

}
