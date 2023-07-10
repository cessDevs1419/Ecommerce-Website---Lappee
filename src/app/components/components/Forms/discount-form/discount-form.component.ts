import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-discount-form',
    templateUrl: './discount-form.component.html',
    styleUrls: ['./discount-form.component.css']
})
export class DiscountFormComponent {
	@Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
	
	productSuccessMessage = 'Product: ';
	errorMessage = 'Please fill in all the required fields.';
	
    @Input() selectedRowData: any;
    @Input() formAddDiscount!: boolean;
    @Input() formEditDiscount!: boolean;
    @Input() formDeleteDiscount!: boolean;
    
    
    addDiscountForm: FormGroup;
	editDiscountForm: FormGroup;
	deleteDiscountForm: FormGroup;
	
    onDiscountAddSubmit(): void {
    
    }
    
    onDiscountEditSubmit(): void {

        
    }
    
    onDiscountDeleteSubmit(): void {

        
    }
}
