import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { throwError } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';

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


    textcolor: string = 'text-light-subtle'
    bordercolor: string = 'dark-subtle-borders'
    @Input() selectedRowData!: any;
    @Input() formConfirm!: boolean;
    @Input() formShip!: boolean;
    @Input() formDelivered!: boolean;
    
    imageSrc: string;
    tobePack: FormGroup;
    tobeShip: FormGroup;
    Delivered: FormGroup;
    
    constructor(
        private orderService: OrderService
    ){
        
        this.tobePack = new FormGroup({
            tobepack: new FormControl(150)
        });
        
        this.tobeShip = new FormGroup({
            tobeship: new FormControl(175)
        });
        
        this.Delivered = new FormGroup({
            todliver: new FormControl(200)
        });
    }
    
    
    
    ngOnInit(): void{
        this.imageSrc = 'https://picsum.photos/200/300';
	}
	
    asyncTask(): Promise<void> {
        // Simulate an asynchronous task with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            }, 1500); 
        });
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
                
                await this.asyncTask();
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
    
    shipPackage(){
        
        let formData: any = new FormData();
        formData.append('order_id',  this.selectedRowData.id);
        formData.append('tracking_no',  this.tobeShip.get('tobeship')?.value);
        
        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        } 
        
        this.orderService.patchShip(formData).subscribe({
            next: async(response: any) => { 
                const successMessage = {
                    head: 'Package To be Ship',
                    sub: response?.message
                };
                
                this.RefreshTable.emit();
                this.OrderSuccess.emit(successMessage);

                await this.asyncTask();
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
    
    delivered(){
        
        let formData: any = new FormData();
        formData.append('order_id',  this.selectedRowData.id);
        formData.append('tracking_no',  this.Delivered.get('todliver')?.value);
        
        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        } 
        
        this.orderService.patchDeliver(formData).subscribe({
            next: async(response: any) => { 
                const successMessage = {
                    head: 'Delivered',
                    sub: response?.message
                };
                
                this.RefreshTable.emit();
                this.OrderSuccess.emit(successMessage);

                await this.asyncTask();
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
}
