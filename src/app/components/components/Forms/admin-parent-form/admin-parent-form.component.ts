import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';

@Component({
    selector: 'app-admin-parent-form',
    templateUrl: './admin-parent-form.component.html',
    styleUrls: ['./admin-parent-form.component.css']
})
export class AdminParentFormComponent {
	
	@ViewChild(ToastComponent) toast: ToastComponent
	@Output() success: EventEmitter<any> = new EventEmitter();
	@Output() invalid: EventEmitter<any> = new EventEmitter();
	@Output() RefreshTable: EventEmitter<void> = new EventEmitter<void>();

	selectedRowData: any;
	
	//CRUD
	AddCategory: boolean;
	EditCategory: boolean;
	
	AddSubCategory: boolean;
	EditSubCategory: boolean;
	
	AddProduct: boolean;
	EditProduct: boolean;
	
	AddVariant: boolean;
	AdditionalVariant: boolean;
	EditVariant: boolean;
	EditAdditionalVariant: boolean;
	EditDatabaseVariant: boolean;
	
    toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default"; 
    
    
	constructor(private route: ActivatedRoute) {}
	
	ngOnInit() {
		this.route.paramMap.subscribe((params) => {
			const page = params.get('page');
		    const action = params.get('action');
		    const id = params.get('id');
		    
			this.AddCategory = page === 'category' && action === 'add';
			this.EditCategory = page === 'category' && action === 'edit';

			
			this.AddSubCategory = page === 'subcategory' && action === 'add';
			this.EditSubCategory = page === 'subcategory' && action === 'edit';
			
			this.AddProduct = page === 'product' && action === 'add';
			this.EditProduct = page === 'product' && action === 'edit';

            this.AddVariant = page === 'variant' && action === 'add';
			this.EditVariant = page === 'variant' && action === 'edit';
			this.AdditionalVariant = page === 'variant' && action === 'additional/to';
			this.EditAdditionalVariant = page === 'variant' && action === 'edit/additional';
			this.EditDatabaseVariant = page === 'variant' && action === 'edit/';
			this.selectedRowData = id
			
		});
	}
	
    //Toast Functions
    
    triggerRefreshTable(): void {
		this.RefreshTable.emit();
	}
	
    postSuccessToast(value: any): void {
        this.toastHeader = value.head;
        this.toastContent = value.sub;
        this.toast.switchTheme('default');
        this.toast.show();
    }
    
	patchSuccessToast(value: any): void {
        this.toastHeader =  value.head;
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



