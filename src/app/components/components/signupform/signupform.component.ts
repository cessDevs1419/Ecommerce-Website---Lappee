import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { uppercaseValidator, numberValidator, lowercaseValidator, samePassValidator, symbolValidator } from 'src/assets/directives/passwordValidator/password-validator.directive';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signupform',
  templateUrl: './signupform.component.html',
  styleUrls: ['./signupform.component.css']
})
export class SignupformComponent {

  @Output() registerSuccess: EventEmitter<any> = new EventEmitter(); 
  response!: Observable<any>;

  constructor(private fb: FormBuilder, private accountsService: AccountsService) {}

  signUpForm = this.fb.group ({
    // signUpFirstName: ['',],
    // signUpMiddleName: [''],
    // signUpLastName: ['',],
    // signUpSuffix: [''],
    signUpEmail: ['', [Validators.required, Validators.email]],
    signUpPassword: ['', [Validators.required, Validators.minLength(7), uppercaseValidator(), numberValidator(), lowercaseValidator(), symbolValidator()]],
    signUpConfirmPassword: ['', [Validators.required]],
    signUpAcceptTerms: ['', Validators.requiredTrue]
  }, { validators: samePassValidator() });


  get signUpFirstName() { return this.signUpForm.get('signUpFirstName') }
  get signUpMiddleName() { return this.signUpForm.get('signUpMiddleName') }
  get signUpLastName() { return this.signUpForm.get('signUpLastName') }
  get signUpSuffix() { return this.signUpForm.get('signUpSuffix') }
  get signUpEmail() { return this.signUpForm.get('signUpEmail') }
  get signUpPassword() { return this.signUpForm.get('signUpPassword') }
  get signUpConfirmPassword() { return this.signUpForm.get('signUpConfirmPassword') }
  get signUpAcceptTerms() { return this.signUpForm.get('signUpAcceptTerms') }

  onSubmit(){
  

    if(this.signUpForm.valid){
      // submit
      console.warn(this.signUpForm.value);

      let formData: any = new FormData();
      // formData.append('first_name', this.signUpForm.get('signUpFirstName')?.value);
      // formData.append('middle_name', this.signUpForm.get('signUpMiddleName')?.value);
      // formData.append('last_name', this.signUpForm.get('signUpLastName')?.value);
      // formData.append('suffix', this.signUpForm.get('signUpSuffix')?.value);
      formData.append('email', this.signUpForm.get('signUpEmail')?.value);
      formData.append('password', this.signUpForm.get('signUpPassword')?.value);
      formData.append('password_confirmation', this.signUpForm.get('signUpConfirmPassword')?.value);

      for(const value of formData.entries()){
        console.log(`${value[0]}, ${value[1]}`);
      }
      
    this.accountsService.postRegisterUser(formData).subscribe({
        next: (response: any) => { 
          console.log(response);
          this.signUpForm.reset();
          this.registerSuccess.emit();
        },
        error: (error: HttpErrorResponse) => {
          return throwError(() => error)
        }
    });
    
    }
    else if(this.signUpForm.invalid){
      this.signUpForm.markAllAsTouched();
    }
  }
}
