import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import * as bootstrap from 'bootstrap'; 
import { Observable, Subject, map, of, startWith, switchMap, tap } from 'rxjs';
import { AdminOrderContent, AdminOrderDetail } from 'src/assets/models/order-details';
import { OrderService } from 'src/app/services/order/order.service';
import { formatAdminOrderDetail } from 'src/app/utilities/response-utils';


@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})



export class ModalComponent {
	//Delete Item
	
	@ViewChild(ToastComponent) toast: ToastComponent;
	@ViewChild('modalRef', { static: true }) modalRef!: ElementRef;

	ordersDetails!: Observable<AdminOrderDetail>;
    orderContents!:Observable<AdminOrderContent>;
    
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
	
    private bsModal: bootstrap.Modal;
    dataLoaded$ = new Subject<boolean>();
    
    backdrop: string = 'true';
	toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  
    

	private refreshData$ = new Subject<void>();

    
    constructor(
		private service: OrderService,
	) {
	
	}


	
    ngOnChanges(): void {
        if (this.selectedRowData) {
            this.loadData();
            
        }
    }
    
    private loadData() {
        // this.ordersDetails = this.refreshData$.pipe(
        //     startWith(undefined), 
        //     switchMap(() => this.service.getAdminOrderDetail(this.selectedRowData.id)),
        //     map((Response: any) => formatAdminOrderDetail(Response))
        // );
        
        this.ordersDetails = this.service.getAdminOrderDetail(this.selectedRowData.id).pipe(
            switchMap((response: any) => {
                const formattedData = formatAdminOrderDetail(response);
                return of(formattedData); 
            }),
            tap((formattedData: any) => {
                // Perform additional actions or computations based on formattedData
                console.log(formattedData); // Example: Log the formatted data
            })
        );
        
        console.log(this.ordersDetails)
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
