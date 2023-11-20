import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable, Subject, map, startWith, switchMap, tap } from 'rxjs';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { AdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { formatAdminCategories, formatAdminSubcategories } from 'src/app/utilities/response-utils';
import { Router } from '@angular/router';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';

@Component({
    selector: 'app-admin-categories',
    templateUrl: './admin-categories.component.html',
    styleUrls: ['./admin-categories.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCategoriesComponent {

    
    @ViewChild(ToasterComponent) toaster: ToasterComponent;
    @ViewChild('triggerFunction') childComponent: TableComponent;
    @ViewChild(TableComponent) table: TableComponent;
    showMinus: boolean
    backdrop: string = 'true';
    toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  

    size = "w-100 me-2"
    selectedRowData: any;
    selectedRowDataForDelete: any;
    categories!: Observable<AdminCategory[]>;
    sub_categories!: Observable<AdminSubcategory[]>;
    private refreshData$ = new Subject<void>();
    
	constructor(
		private category_service: CategoriesService,
        private subcategory_service: SubcategoriesService,
        private router: Router
	) {
    
	}
	
	ngOnInit(): void{
    
        this.categories = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.category_service.getAdminCategories()),
            map((Response: any) => formatAdminCategories(Response))  ,
            tap(() => {
                this.table.loaded()
            })
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

    showMinusFunction(){
        this.childComponent.removeAllSelected();
    }

    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
    }

    onRowDataForDelete(rowData: any){
        this.selectedRowDataForDelete = rowData;
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
