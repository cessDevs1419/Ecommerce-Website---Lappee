import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import * as bootstrap from 'bootstrap'; 
import { Observable, Subject, map, of, startWith, switchMap, tap } from 'rxjs';
import { AdminOrderContent, AdminOrderDetail, AdminOrderDetailList } from 'src/assets/models/order-details';
import { OrderService } from 'src/app/services/order/order.service';
import { formatAdminOrderDetail, formatProducts } from 'src/app/utilities/response-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from 'src/assets/models/products';
import { ProductsService } from 'src/app/services/products/products.service';


@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})



export class ModalComponent {
	//Delete Item
	
	@ViewChild(ToastComponent) toast: ToastComponent;
	@ViewChild('modalRef') modalRef!: ElementRef;


    
	@Output() success: EventEmitter<any> = new EventEmitter();
	@Output() invalid: EventEmitter<any> = new EventEmitter();
	@Output() delete: EventEmitter<any> = new EventEmitter();
	@Output() RefreshTable: EventEmitter<void> = new EventEmitter<void>();
	
	@Input() modalId!: string;
    @Input() modalTitle!: string;
	@Input() modalSubTitle!: string;
	@Input() modalClass!: string;
	
	@Input() selectedRowData: any;
	@Input() modalDeleteCategory!: boolean;
	@Input() modalDeleteSubCategory!: boolean;
	@Input() modalDeleteProduct!: boolean; 
	@Input() modalDeleteVariant!: boolean;
	@Input() modalBanAccounts!: boolean;  
	@Input() modalUnBanAccounts!: boolean; 
	@Input() modalViewOrders!: boolean;
	@Input() modalData!: Observable<any>;
	
    private bsModal: bootstrap.Modal;
    dataLoaded$ = new Subject<boolean>();
    
    backdrop: string = 'true';
	toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  
    

	private refreshData$ = new Subject<void>();


    
    constructor(
		private service: OrderService,
		private product_service: ProductsService
	) {
	
	}

	ngOnInit(): void{
	    if(this.modalData){
            console.log(this.modalData)
	    }
	}
	
    
    
    asyncTask(): Promise<void> {
        // Simulate an asynchronous task with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            }, 2500); 
        });
    }
    
    async closeModal() {
        await this.asyncTask();
    }

	triggerRefreshTable(): void {
		this.RefreshTable.emit();
        console.log('nagana')
	}

    
	deleteSuccessToast(value: any): void {
        this.toastHeader = value.head;
        this.toastContent = value.sub;
        this.toast.switchTheme('default');
        this.toast.show();
    }
    
	banSuccessToast(value: string): void {
        this.toastHeader = value;
        this.toastContent = "Successfully Banned";
        this.toast.switchTheme('default');
        this.toast.show();
    }
    
	unbanSuccessToast(value: string): void {
        this.toastHeader = value;
        this.toastContent = "Successfully UnBanned";
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
