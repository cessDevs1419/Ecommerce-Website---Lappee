import { Directive } from '@angular/core';
import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export function uppercaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let pass = /[A-Z]+/.test(control.value);
    //console.log(control.value + " VALID = " + pass);
    if(!control.value) { pass = true } // ignore empty inputs
    return pass ? null : {passwordUppercase: {value: control.value}};
  }
}

export function numberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let pass = /[0-9]+/.test(control.value);
    //console.log(control.value + " VALID = " + pass);
    if(!control.value) { pass = true } // ignore empty inputs
    return pass ? null : {passwordNumber: {value: control.value}};
  }
}

export function lowercaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let pass = /[a-z]+/.test(control.value);
    //console.log(control.value + " VALID = " + pass);
    if(!control.value) { pass = true } // ignore empty inputs
    return pass ? null : {passwordLowercase: {value: control.value}};
  }
}

export function samePassValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('signUpPassword');
    const confirm = control.get('signUpConfirmPassword');
    console.log(password?.value + " | " + confirm?.value);
    return password && confirm && password.value == confirm.value ? null : { samePassword: {value: control.value} } ;
  }
}



@Directive({
  selector: '[appPasswordValidator]'
})
export class PasswordValidatorDirective {

  constructor() { }

}
