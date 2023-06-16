import { Component } from '@angular/core';
import { Login } from 'src/assets/models/account';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts/accounts.service';

@Component({
  selector: 'app-signinform',
  templateUrl: './signinform.component.html',
  styleUrls: ['./signinform.component.css']
})
export class SigninformComponent {
  
  model: Login = {
    email: '',
    password: '',
    rememberMe: false,
  }

  response!: Observable<any>;

  signInForm = new FormGroup ({
    signInEmail: new FormControl('', Validators.required),
    signInPassword: new FormControl('', Validators.required)
  });

  get signInEmail() { return this.signInForm.get('signInEmail') }
  get signInPassword() { return this.signInForm.get('signInPassword') }

  constructor(private accountService: AccountsService) {}

  onSubmit(){
    if(this.signInForm.valid){
      //submit
      console.warn(this.signInForm.value);

      let formData: any = new FormData();
      formData.append('email', this.signInForm.get('signInEmail')?.value);
      formData.append('password', this.signInForm.get('signInPassword')?.value);
      formData.append('rememberMe', false);

      this.response = this.accountService.postLoginUser(formData);

      this.accountService.isLoggedIn = true;
    }
    else if(this.signInForm.invalid){
      this.signInForm.markAllAsTouched();
      console.log("invalid");
    }
  }
}
