import { Component } from '@angular/core';
import { SignIn } from 'src/assets/models/entry';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signinform',
  templateUrl: './signinform.component.html',
  styleUrls: ['./signinform.component.css']
})
export class SigninformComponent {
  
  model: SignIn = {
    email: '',
    password: '',
    rememberMe: false,
  }

  signInForm = new FormGroup ({
    signInEmail: new FormControl('', Validators.required),
    signInPassword: new FormControl('', Validators.required)
  });

  get signInEmail() { return this.signInForm.get('signInEmail') }
  get signInPassword() { return this.signInForm.get('signInPassword') }


  onSubmit(){
    if(this.signInForm.valid){
      //submit
      console.warn(this.signInForm.value);
    }
    else if(this.signInForm.invalid){
      this.signInForm.markAllAsTouched();
    }
  }
}
