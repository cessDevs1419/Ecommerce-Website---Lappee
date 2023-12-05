import { Component, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-discount-form',
    templateUrl: './discount-form.component.html',
    styleUrls: ['./discount-form.component.css']
})
export class DiscountFormComponent {
	@Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
	@ViewChild('date1') date1: ElementRef;
    @ViewChild('date2') date2: ElementRef;
	productSuccessMessage = 'Product: ';
	errorMessage = 'Please fill in all the required fields.';
    inputColor: string = "text-white"
    borderColor: string = "border-grey"
    textcolor: string = 'text-light-subtle'
    bordercolor: string = 'dark-subtle-borders'
    titleColor : string = 'dark-theme-text-color';
	itemColor: string = 'text-white-50';
    selectedReason: string = '';

    @Input() selectedRowData: any;
    @Input() formAddDiscount!: boolean;
    @Input() formEditDiscount!: boolean;
    @Input() formDeleteDiscount!: boolean;
    
    from: string = 'Select Date From';
    to: string = 'Select Date To'; 
    addDiscountForm: FormGroup;
	editDiscountForm: FormGroup;
	deleteDiscountForm: FormGroup;
	
    constructor(){
        this.addDiscountForm = new FormGroup({
            type: new FormControl('', Validators.required),
            value: new FormControl('', Validators.required),
            duration_from: new FormControl('', Validators.required),
            duration_to: new FormControl('', Validators.required),
        });
    }
    selectFromDate(){
		this.date1.nativeElement.showPicker()
	}

    selectToDate(){
		this.date2.nativeElement.showPicker()
	}

	getDateFromValue(event: any) {
		const date = event.target.value;
        this.from = date
	}

    getDateToValue(event: any) {
		const date = event.target.value;
        this.to = date
	}

    onDiscountAddSubmit(): void {
        console.log(this.addDiscountForm.value)
    }
    
    onDiscountEditSubmit(): void {

        
    }
    
    onDiscountDeleteSubmit(): void {

        
    }
}
