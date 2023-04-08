import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { uppercaseValidator, numberValidator, lowercaseValidator, samePassValidator } from 'src/assets/directives/passwordValidator/password-validator.directive';

@Component({
  selector: 'app-signupform',
  templateUrl: './signupform.component.html',
  styleUrls: ['./signupform.component.css']
})
export class SignupformComponent {

  constructor(private fb: FormBuilder) {}

  signUpForm = this.fb.group ({
    signUpFirstName: ['', Validators.required],
    signUpMiddleName: [''],
    signUpLastName: ['', Validators.required],
    signUpSuffix: [''],
    signUpEmail: ['', [Validators.required, Validators.email]],
    signUpPassword: ['', [Validators.required, Validators.minLength(7), uppercaseValidator(), numberValidator(), lowercaseValidator()]],
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
    }
    else if(this.signUpForm.invalid){
      this.signUpForm.markAllAsTouched();
    }
  }
}
