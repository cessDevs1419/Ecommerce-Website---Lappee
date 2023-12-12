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
import { OrdersFormComponent } from '../Forms/orders-form/orders-form/orders-form.component';
import { ShippingFee } from 'src/assets/models/shipping';


@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})



export class ModalComponent {
	//Delete Item
	
	@ViewChild(ToastComponent) toast: ToastComponent;
	@ViewChild(OrdersFormComponent) orders: OrdersFormComponent;
	@ViewChild('modalRef') modalRef!: ElementRef;
    @ViewChild('dismiss') dismiss: ElementRef;

    
	@Output() success: EventEmitter<any> = new EventEmitter();
	@Output() invalid: EventEmitter<any> = new EventEmitter();
	@Output() delete: EventEmitter<any> = new EventEmitter();
	@Output() RefreshTable: EventEmitter<void> = new EventEmitter<void>();
	@Output() confirm: EventEmitter<any> = new EventEmitter();
    @Output() ship: EventEmitter<any> = new EventEmitter();
	@Output() deliver: EventEmitter<any> = new EventEmitter();
    @Output() SuccessToast: EventEmitter<any> = new EventEmitter();
	@Output() ErrorToasts: EventEmitter<any> = new EventEmitter();
    @Output() WarningToasts: EventEmitter<any> = new EventEmitter();
    @Output() hideMinus: EventEmitter<any> = new EventEmitter();


	@Input() modalId!: string;
    @Input() modalTitle!: string;
	@Input() modalSubTitle!: string;
    @Input() modalTitleClass!: string;
	@Input() modalSubTitleClass!: string;
    @Input() modalinfoTitle!: any;
	@Input() modalClass!: string;
	@Input() modalHideCloseBtn!: boolean;
	@Input() modalHideIcon!: boolean;
	@Input() modalIcon!: string;
	
	@Input() selectedRowData: any;
	@Input() selectedRowDataForDelete: any;
	@Input() modalLogout!: boolean;
	@Input() modalAddAttribute!: boolean;
	@Input() modalEditAttribute!: boolean;
    @Input() modalDeleteAttribute!: boolean;
    @Input() modalMultipleDeleteAttribute!: boolean;
    @Input() modalMultipleDeleteCategory!: boolean;
    @Input() modalSelectAttribute!: boolean;
    @Input() modalAddCategory!: boolean;
    @Input() modalEditCategory!: boolean;
	@Input() modalDeleteCategory!: boolean;
	@Input() modalDeleteSubCategory!: boolean;
	@Input() modalDeleteProduct!: boolean; 
	@Input() modalMultipleDeleteProduct!: boolean; 
	@Input() modalDeleteVariant!: boolean;
	@Input() modalBanAccounts!: boolean;  
	@Input() modalUnBanAccounts!: boolean; 
	@Input() modalViewOrders!: boolean;
	@Input() allowAnotherSub!: boolean;
    @Input() modalChat!: boolean;  
    @Input() modalConfirm!: boolean; 
    @Input() modalConfirmHold!: boolean; 
    @Input() modalPacked!: boolean;  
	@Input() modalShip!: boolean; 
	@Input() modalDeliver!: boolean;
    @Input() modalAddReason!: boolean;
    @Input() modalAddProductGroup!: boolean;
    @Input() modalAddDiscounts!: boolean;
    @Input() modalRestocks!: boolean;
    @Input() modalMultipleShipOrder!: boolean;
    @Input() modalMultipleShippingOrder!: boolean;
    @Input() modalMultipleDeliveredOrder!: boolean;
    @Input() modalCancel!: boolean;
    @Input() modalShippingFee!: boolean;
    @Input() modalShippingFeeEditObject!: ShippingFee;
    @Input() modalShippingFeeViewObject!: ShippingFee;
    @Input() modalShippingFeeModeAdd!: boolean;
    @Input() modalShippingFeeModeView!: boolean;
	@Input() modalData!: Observable<any>;
    @Input() modalCancelledData!: Observable<any>;
	@Input() orderData!: Observable<any>;
	@Input() modalSubData!: Observable<any>;
    @Input() modalDataImg!: Observable<any>;

	selectedAttributeData: any;
	//modal theme
	modalTheme: string = 'table-bg-dark';
	modalTitleColor : string = 'dark-theme-text-color';
	modalBorderColor: string = 'border-grey';
	modalHeaderColor: string = 'text-white';
	modalitemColor: string = 'text-white-50';
    private bsModal: bootstrap.Modal;
    dataLoaded$ = new Subject<boolean>();
    ordersDetails!: Observable<AdminOrderDetail>;

    backdrop: string = 'true';
	toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  
    
    index: number | null = null;
	private refreshData$ = new Subject<void>();


    
    constructor(
		private service: OrderService,
		private product_service: ProductsService
	) {
	    
	}

	ngOnInit(): void{
        console.log("modalEdit", this.modalShippingFeeEditObject);
        console.log("modalAdd", this.modalShippingFeeModeAdd);
        console.log("modalView", this.modalShippingFeeModeView);
        console.log("modal", this.modalShippingFee);
	}

    ngOnChanges(): void {}



    refreshTableData(): void {
        this.RefreshTable.emit();
    }

    indexVariant(index: number){
        console.log(index)
    }
    
    confirmPayment(){
        this.confirm.emit()
    }
    
    shipPackage(){
        this.ship.emit()
    }
    
    deliverPackage(){
        this.deliver.emit()
    }
    hideMinusFunction() {
        this.hideMinus.emit();
    }
    asyncTask(): Promise<void> {
        // Simulate an asynchronous task with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            }, 2500); 
        });
    }
    onLogout(){
        this.confirm.emit()
        this.closeModal()
    }
    setname(isHold: boolean){
        if(isHold){
            this.modalTitle = 'Hold Order'
        }else{
            this.modalTitle = 'Confirm Payment'
        }
    }
    setmodalname(isHold: boolean){
        if(isHold){
            this.modalTitle = 'Select Products'
            this.modalSubTitle = 'Discount Applications'
            this.modalClass = ' modal-dialog-scrollable modal-lg'
            this.modalIcon = 'edit'
        }else{
            this.modalTitle = 'Add Discount'
            this.modalSubTitle = ''
            this.modalClass = 'modal-mg'
            this.modalIcon = 'add'
        }
    }

    sendAttribute(value: any){
        this.selectedAttributeData = value
    }
    
    async closeModal() {
        this.dismiss.nativeElement.click();
    }

	triggerRefreshTable(): void {
		this.RefreshTable.emit();
	}

    
	deleteSuccessToast(value: any): void {
        this.SuccessToast.emit(value)
    }
    
	banSuccessToast(value: string): void {
        this.SuccessToast.emit(value)
    }
    
	unbanSuccessToast(value: string): void {
        this.SuccessToast.emit(value)
    }
    
    WarningToast(value: any): void {
        this.WarningToasts.emit(value)
    }
    
	ErrorToast(value: any): void {
        this.ErrorToasts.emit(value)
    }
    
    

}
