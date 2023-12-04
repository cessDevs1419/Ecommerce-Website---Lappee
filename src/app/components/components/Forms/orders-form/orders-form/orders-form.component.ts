import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';
import { formatAdminOrderDetail } from 'src/app/utilities/response-utils';
import { AdminOrderDetail } from 'src/assets/models/order-details';

@Component({
    selector: 'app-orders-form',
    templateUrl: './orders-form.component.html',
    styleUrls: ['./orders-form.component.css']
})
export class OrdersFormComponent {
    @Output() OrderSuccess: EventEmitter<any> = new EventEmitter();
    @Output() OrderWarn: EventEmitter<any> = new EventEmitter();
	@Output() OrderError: EventEmitter<any> = new EventEmitter();
	@Output() confirm: EventEmitter<any> = new EventEmitter();
	@Output() ship: EventEmitter<any> = new EventEmitter();
    @Output() CloseModal: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();
    @Output() Hold: EventEmitter<boolean> = new EventEmitter();

    inputColor: string = "text-white"
    borderColor: string = "border-grey"
    textcolor: string = 'text-light-subtle'
    bordercolor: string = 'dark-subtle-borders'
    titleColor : string = 'dark-theme-text-color';
	itemColor: string = 'text-white-50';
    selectedReason: string = '';

    @Input() selectedRowData!: any;
    @Input() formConfirm!: boolean;
    @Input() formConfirmHold!: boolean;
    @Input() formPacked!: boolean;
    @Input() formShip!: boolean;
    @Input() formDelivered!: boolean;
    @Input() formCancel!: boolean;
    @Input() modalConfirmData!: any;
    @Input() modalDataImg!: Observable<any>;
    @Input() modalData!: any;
    @Input() formMultipleOrders!: boolean;
    @Input() selectedRowDataForDelete: any[] = [];
    
    showAmount: boolean = false;
    showReason: boolean = false;
    formHold: boolean = false;
    imageSrc: string;
    tobePack: FormGroup;
    tobeShip: FormGroup;
    tobeDelivered: FormGroup;
    Delivered: FormGroup;
    canceled: FormGroup;
    HoldsOrder: FormGroup;
	ordersDetails!: Observable<AdminOrderDetail>;
    fetchedData: AdminOrderDetail | undefined;
    
    constructor(
        private orderService: OrderService,

    ){
        
        this.tobePack = new FormGroup({
            tobepack: new FormControl(100)
        });
        
        this.tobeShip = new FormGroup({
            tobeship: new FormControl(150)
        });
        
        this.tobeDelivered = new FormGroup({
            todliver: new FormControl(175)
        });
        
        this.Delivered = new FormGroup({
            todliver: new FormControl(200)
        });

        this.HoldsOrder = new FormGroup({
            amount: new FormControl('', Validators.required),
            reason: new FormControl('', Validators.required),
        });
    }
    
    
    ngOnInit(): void{

    }
	
    asyncTask(): Promise<void> {
        // Simulate an asynchronous task with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            }, 1500); 
        });
    }

    onRadioChange(reason: string): void {
        switch (reason) {
            case 'Insufficient Amount':
                this.showReason = false
                this.showAmount = true
                
            break;
            
            case 'Unclear Address':
                this.showReason = false
                this.showAmount = false

            break;
            
            case 'Scammer':
                this.showReason = false
                this.showAmount = false
               
            break;
            
            case 'Others':
                this.showReason = true
                this.showAmount = false
            break;
            
            default:
                this.showReason = false
                this.showAmount = false
          }        
      this.selectedReason = reason;
    }

    hasData(data: any): boolean {
        return !!data && (Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0);
    }      

    confirmPayment(){  
        
        let formData: any = new FormData();
        formData.append('order_id',  this.selectedRowData.id);
        formData.append('tracking_no',  this.tobePack.get('tobepack')?.value);
        
        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        }
        
        this.orderService.patchPack(formData).subscribe({
            next: async(response: any) => { 
                const successMessage = {
                    head: 'Payment Confirmation',
                    sub: response?.message
                };
                
                this.RefreshTable.emit();
                this.OrderSuccess.emit(successMessage);
                
                this.CloseModal.emit();
            },
            error: (error: HttpErrorResponse) => {
                if (error.error?.data?.error) {
                    const fieldErrors = error.error.data.error;
                    const errorsArray = [];
                
                    for (const field in fieldErrors) {
                        if (fieldErrors.hasOwnProperty(field)) {
                            const messages = fieldErrors[field];
                            let errorMessage = messages;
                            if (Array.isArray(messages)) {
                                errorMessage = messages.join(' '); 
                            }
                            errorsArray.push(errorMessage);
                        }
                    }
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: errorsArray,
                    };
                
                    this.OrderWarn.emit(errorDataforProduct);
                } else {
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: 'Please Try Another One',
                    };
                    this.OrderError.emit(errorDataforProduct);
                }
                return throwError(() => error);
            }

        });
        
    }
    
    packed(){
        
        let formData: any = new FormData();
        formData.append('order_id',  this.selectedRowData.id);
        formData.append('tracking_no',  this.tobeShip.get('tobeship')?.value);
        
        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        } 
        
        this.orderService.patchToShip(formData).subscribe({
            next: async(response: any) => { 
                const successMessage = {
                    head: 'Package To be Ship',
                    sub: response?.message
                };
                
                this.RefreshTable.emit();
                this.OrderSuccess.emit(successMessage);

                this.CloseModal.emit();
            },
            error: (error: HttpErrorResponse) => {
                if (error.error?.data?.error) {
                    const fieldErrors = error.error.data.error;
                    const errorsArray = [];
                
                    for (const field in fieldErrors) {
                        if (fieldErrors.hasOwnProperty(field)) {
                            const messages = fieldErrors[field];
                            let errorMessage = messages;
                            if (Array.isArray(messages)) {
                                errorMessage = messages.join(' '); 
                            }
                            errorsArray.push(errorMessage);
                        }
                    }
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: errorsArray,
                    };
                
                    this.OrderWarn.emit(errorDataforProduct);
                } else {
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: 'Please Try Another One',
                    };
                    this.OrderError.emit(errorDataforProduct);
                }
                return throwError(() => error);
            }

        });
    }
    
    shipPackage(){
        
        let formData: any = new FormData();
        formData.append('order_id',  this.selectedRowData.id);
        formData.append('tracking_no',  this.tobeDelivered.get('todliver')?.value);
        
        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        } 
        
        this.orderService.patchShip(formData).subscribe({
            next: async(response: any) => { 
                const successMessage = {
                    head: 'Shipping Package',
                    sub: response?.message
                };
                
                this.RefreshTable.emit();
                this.OrderSuccess.emit(successMessage);

                this.CloseModal.emit();
            },
            error: (error: HttpErrorResponse) => {
                if (error.error?.data?.error) {
                    const fieldErrors = error.error.data.error;
                    const errorsArray = [];
                
                    for (const field in fieldErrors) {
                        if (fieldErrors.hasOwnProperty(field)) {
                            const messages = fieldErrors[field];
                            let errorMessage = messages;
                            if (Array.isArray(messages)) {
                                errorMessage = messages.join(' '); 
                            }
                            errorsArray.push(errorMessage);
                        }
                    }
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: errorsArray,
                    };
                
                    this.OrderWarn.emit(errorDataforProduct);
                } else {
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: 'Please Try Another One',
                    };
                    this.OrderError.emit(errorDataforProduct);
                }
                return throwError(() => error);
            }

        });
    }
    
    delivered(){
        
        let formData: any = new FormData();
        formData.append('order_id',  this.selectedRowData.id);
        formData.append('tracking_no',  this.Delivered.get('todliver')?.value);
        
        this.orderService.patchDeliver(formData).subscribe({
            next: async(response: any) => { 
                const successMessage = {
                    head: 'Delivered',
                    sub: response?.message
                };
                
                this.RefreshTable.emit();
                this.OrderSuccess.emit(successMessage);

                this.CloseModal.emit();
            },
            error: (error: HttpErrorResponse) => {
                if (error.error?.data?.error) {
                    const fieldErrors = error.error.data.error;
                    const errorsArray = [];
                
                    for (const field in fieldErrors) {
                        if (fieldErrors.hasOwnProperty(field)) {
                            const messages = fieldErrors[field];
                            let errorMessage = messages;
                            if (Array.isArray(messages)) {
                                errorMessage = messages.join(' '); 
                            }
                            errorsArray.push(errorMessage);
                        }
                    }
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: errorsArray,
                    };
                
                    this.OrderWarn.emit(errorDataforProduct);
                } else {
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: 'Please Try Another One',
                    };
                    this.OrderError.emit(errorDataforProduct);
                }
                return throwError(() => error);
            }

        });
    }

    cancel(){
        
        let formData: any = new FormData();
        formData.append('cancellation_id',  this.selectedRowData.id);
        
        this.orderService.patchCancel(formData).subscribe({
            next: async(response: any) => { 
                const successMessage = {
                    head: 'Cancel Order',
                    sub: response?.message
                };
                
                this.RefreshTable.emit();
                this.OrderSuccess.emit(successMessage);

                this.CloseModal.emit();
            },
            error: (error: HttpErrorResponse) => {
                if (error.error?.data?.error) {
                    const fieldErrors = error.error.data.error;
                    const errorsArray = [];
                
                    for (const field in fieldErrors) {
                        if (fieldErrors.hasOwnProperty(field)) {
                            const messages = fieldErrors[field];
                            let errorMessage = messages;
                            if (Array.isArray(messages)) {
                                errorMessage = messages.join(' '); 
                            }
                            errorsArray.push(errorMessage);
                        }
                    }
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: errorsArray,
                    };
                
                    this.OrderWarn.emit(errorDataforProduct);
                } else {
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: 'Please Try Another One',
                    };
                    this.OrderError.emit(errorDataforProduct);
                }
                return throwError(() => error);
            }
            
        });
    }

    deny(){
        
        let formData: any = new FormData();
        formData.append('cancellation_id',  this.selectedRowData.id);

        
        this.orderService.patchDeny(formData).subscribe({
            next: async(response: any) => { 
                const successMessage = {
                    head: 'Cancel Order',
                    sub: response?.message
                };
                
                this.RefreshTable.emit();
                this.OrderSuccess.emit(successMessage);

                this.CloseModal.emit();
            },
            error: (error: HttpErrorResponse) => {
                if (error.error?.data?.error) {
                    const fieldErrors = error.error.data.error;
                    const errorsArray = [];
                
                    for (const field in fieldErrors) {
                        if (fieldErrors.hasOwnProperty(field)) {
                            const messages = fieldErrors[field];
                            let errorMessage = messages;
                            if (Array.isArray(messages)) {
                                errorMessage = messages.join(' '); 
                            }
                            errorsArray.push(errorMessage);
                        }
                    }
                
                    const errorDataforProduct = {
                        errorMessage: 'Error Invalid Inputs',
                        suberrorMessage: errorsArray,
                    };
                
                    this.OrderWarn.emit(errorDataforProduct);
                } else {
                
                    const errorDataforProduct = {
                        errorMessage: 'Error Invalid Inputs',
                        suberrorMessage: 'Please Try Another One',
                    };
                    this.OrderError.emit(errorDataforProduct);
                }
                return throwError(() => error);
            }
            
        });
    }

    hold(){
        // this.formConfirm = false
        this.formHold = true
        this.Hold.emit(true)
    }

    backtoconfirm(){
        // this.formConfirm = true
        this.formHold = false
        this.Hold.emit(false)
    }

    holdOrders(){
        let formData: any = new FormData();
        formData.append('order_id',  this.selectedRowData.id);
        switch (this.selectedReason) {
            case 'Insufficient Amount':
                this.showReason = false
                this.showAmount = true
                formData.append('reason',  'Insufficient Amount Paid - Customer sent a payment but did not meet the required amount.');
                formData.append('balance', this.HoldsOrder.get('amount')?.value);
            break;
            
            case 'Unclear Address':
                this.showReason = false
                this.showAmount = false
                formData.append('reason',  'Unclear Address - Customer\'s address is not complete or is unclear and confusing.');
                formData.append('balance', null);
            break;
            
            case 'Scammer':
                this.showReason = false
                this.showAmount = false
                formData.append('reason',  'Fraud Customer - Customer has a history of not completing orders.');
                formData.append('balance', null);
            break;
            
            case 'Others':
                this.showReason = true
                this.showAmount = false
                formData.append('reason',  this.HoldsOrder.get('reason')?.value);
                formData.append('balance', null);
            break;
            
            default:
                this.showReason = false
                this.showAmount = false
                formData.append('reason',  this.selectedReason);
                formData.append('balance', null);
            }     

        // for (const value of formData.entries()) {
        //     console.log(`${value[0]}, ${value[1]}`);
        // } 

        this.orderService.patchHold(formData).subscribe({
            next: async(response: any) => { 
                const successMessage = {
                    head: 'Hold Order',
                    sub: response?.message
                };
                
                this.RefreshTable.emit();
                this.OrderSuccess.emit(successMessage);

                this.CloseModal.emit();
            },
            error: (error: HttpErrorResponse) => {
                if (error.error?.data?.error) {
                    const fieldErrors = error.error.data.error;
                    const errorsArray = [];
                
                    for (const field in fieldErrors) {
                        if (fieldErrors.hasOwnProperty(field)) {
                            const messages = fieldErrors[field];
                            let errorMessage = messages;
                            if (Array.isArray(messages)) {
                                errorMessage = messages.join(' '); 
                            }
                            errorsArray.push(errorMessage);
                        }
                    }
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: errorsArray,
                    };
                
                    this.OrderWarn.emit(errorDataforProduct);
                } else {
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: 'Please Try Another One',
                    };
                    this.OrderError.emit(errorDataforProduct);
                }
                return throwError(() => error);
            }
            
        });
    }

    onOrderUpdate(){

    }
}
