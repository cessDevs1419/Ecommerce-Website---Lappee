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
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();


    
    @Input() selectedRowData!: any;
    @Input() formConfirm!: boolean;
    @Input() formShip!: boolean;
    @Input() formDelivery!: boolean;
    
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
            tobepack: new FormControl(175)
        });
        
        this.Delivered = new FormGroup({
            tobepack: new FormControl(200)
        });
    }
    
    
    
    ngOnInit(): void{
        this.imageSrc = './assets/favicon.png';
        console.log(this.selectedRowData)
	}
	

    
    confirmPayment(){  
        
        let formData: any = new FormData();
        formData.append('order_id',  this.selectedRowData.order_id);
        formData.append('tracking_no',  this.tobePack.get('tobepack')?.value);
        
        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        }
        
        // this.orderService.patchPack(formData).subscribe({
        //     next: async(response: any) => { 
        //         const successMessage = {
        //             head: 'Payment Confirmation',
        //             sub: response?.message
        //         };
                
        //         this.RefreshTable.emit();
        //         this.OrderSuccess.emit(successMessage);
        //         this.confirm.emit()
        //     },
        //     error: (error: HttpErrorResponse) => {
        //         if (error.error?.data?.error) {
        //             const fieldErrors = error.error.data.error;
        //             const errorsArray = [];
                
        //             for (const field in fieldErrors) {
        //                 if (fieldErrors.hasOwnProperty(field)) {
        //                     const messages = fieldErrors[field];
        //                     let errorMessage = messages;
        //                     if (Array.isArray(messages)) {
        //                         errorMessage = messages.join(' '); 
        //                     }
        //                     errorsArray.push(errorMessage);
        //                 }
        //             }
                
        //             const errorDataforProduct = {
        //                 errorMessage: 'Error Invalid Inputs',
        //                 suberrorMessage: errorsArray,
        //             };
                
        //             this.OrderWarn.emit(errorDataforProduct);
        //         } else {
                
        //             const errorDataforProduct = {
        //                 errorMessage: 'Error Invalid Inputs',
        //                 suberrorMessage: 'Please Try Another One',
        //             };
        //             this.OrderError.emit(errorDataforProduct);
        //         }
        //         return throwError(() => error);
        //     }

        // });
        
    }
    
    shipPackage(){
        this.ship.emit()
    }
}
