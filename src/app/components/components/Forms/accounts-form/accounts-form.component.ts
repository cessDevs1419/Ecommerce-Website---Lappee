import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
    selector: 'app-accounts-form',
    templateUrl: './accounts-form.component.html',
    styleUrls: ['./accounts-form.component.css']
})
export class AccountsFormComponent {
	@Output() BanSuccess: EventEmitter<any> = new EventEmitter();
	@Output() BanError: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();
    
    @Input() selectedRowData: any;
    @Input() formBanAccount!: boolean;
    @Input() formUnBanAccount!: boolean;
    
    BanSuccessMessage = 'User: ';
	errorMessage = 'Please fill in all the required fields.';
	
    banTitle: 'BAN ACCOUNT';
    unbanTitle: 'UNBAN ACCOUNT';
    banFormID: 'ban';
    unbanFormID: 'unban';
    
    title: '';
    Id: '';
    
    banAccountForm: FormGroup;
    unbanAccountForm: FormGroup;

	constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private userService: UsersService
    ) 
    {
        this.banAccountForm = new FormGroup({
            user_id: new FormControl('', Validators.required),
            account_reason: new FormControl('', Validators.required)
        });
        
        this.unbanAccountForm = new FormGroup({
            user_id: new FormControl('', Validators.required)
        });
    }
    
    onAccountBanSubmit(): void {

        let formData: any = new FormData();
        formData.append('user_id', this.selectedRowData.user_id);
        formData.append('reason', this.banAccountForm.get('account_reason')?.value);
        
        this.userService.banUsers(formData).subscribe({
            next: (response: any) => { 
                console.log(response)
                this.RefreshTable.emit();
                this.BanSuccess.emit(this.BanSuccessMessage + this.selectedRowData.fname);
                this.banAccountForm.reset();
            },
            error: (error: HttpErrorResponse) => {
                return throwError(() => error)
            }
        });

        
    }
    
    onAccountUnBanSubmit(): void {
        this.userService.unbanUsers(this.selectedRowData.user_id).subscribe({
            next: (response: any) => { 
                console.log(response)
                this.RefreshTable.emit();
                this.BanSuccess.emit(this.BanSuccessMessage+this.selectedRowData.fname);
                this.unbanAccountForm.reset();
            },
            error: (error: HttpErrorResponse) => {
                return throwError(() => error)
            }
        });
    }
    
    

}
