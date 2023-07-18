import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { AdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { formatAdminCategories, formatAdminSubcategories } from 'src/app/utilities/response-utils';

@Component({
    selector: 'app-admin-categories',
    templateUrl: './admin-categories.component.html',
    styleUrls: ['./admin-categories.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCategoriesComponent {

    
    
    size = "w-100"
    
    /*SET DATA*/
    categories!: Observable<AdminCategory[]>;
    sub_categories!: Observable<AdminSubcategory[]>;
    private refreshData$ = new Subject<void>();
    
	constructor(
		private category_service: CategoriesService,
        private subcategory_service: SubcategoriesService
	) {
    
	}
	
	ngOnInit(): void{
    
    	
        this.categories = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.category_service.getAdminCategories()),
            map((Response: any) => formatAdminCategories(Response))
        );
        
        this.sub_categories = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.subcategory_service.getAdminSubcategories()),
            map((Response: any) => formatAdminSubcategories(Response))
        );
	}
	
    refreshTableData(): void {
        this.refreshData$.next();
    }

	
    selectedRowData: any;
    
    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
    }




}
