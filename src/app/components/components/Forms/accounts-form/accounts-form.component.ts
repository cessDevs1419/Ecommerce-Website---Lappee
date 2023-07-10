import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-accounts-form',
    templateUrl: './accounts-form.component.html',
    styleUrls: ['./accounts-form.component.css']
})
export class AccountsFormComponent {
	@Output() BanSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
	
	productSuccessMessage = 'Product: ';
	errorMessage = 'Please fill in all the required fields.';
	
    @Input() selectedRowData: any;
    @Input() formBanAccount!: boolean;
    
    
    banAccountForm: FormGroup;

	
    onAccountBanSubmit(): void {
    
    }
}
