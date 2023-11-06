import { Component, EventEmitter, Output } from '@angular/core';
import { Login } from 'src/assets/models/account';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/assets/models/user';
import { OutlineCircleSpinnerComponent } from '../loader/general/outline-circle-spinner/outline-circle-spinner/outline-circle-spinner.component';

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

  isLoading: boolean = false;
  circleLoader = OutlineCircleSpinnerComponent;

  @Output() loginSuccess: EventEmitter<any> = new EventEmitter();
  @Output() invalidCredentials: EventEmitter<any> = new EventEmitter();
  response!: Observable<any>;

  signInForm = new FormGroup ({
    signInEmail: new FormControl('', Validators.required),
    signInPassword: new FormControl('', Validators.required),
    signInRememberMe: new FormControl('')
  });

  get signInEmail() { return this.signInForm.get('signInEmail') }
  get signInPassword() { return this.signInForm.get('signInPassword') }
  get signInRememberMe() { return this.signInForm.get('signInRememberMe') }

  constructor(private accountService: AccountsService, private router: Router) {}

  onSubmit(){
    if(this.signInForm.valid){
      //submit
      this.isLoading = true;

      let formData: any = new FormData();
      formData.append('email', this.signInForm.get('signInEmail')?.value);
      formData.append('password', this.signInForm.get('signInPassword')?.value);
      formData.append('rememberMe', this.signInForm.get('signInRememberMe')?.value ? 1 : 0);

      console.log(formData);

      this.accountService.postLoginUser(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.isLoading = false;
          this.signInForm.reset();
          this.loginSuccess.emit();
          this.accountService.checkLoggedIn().subscribe();
          if(response.data.user_type == 200) {
            setTimeout(() => {
              this.router.navigate(['/admin/overview']);
            },1000);
          }
          else {
            setTimeout(() => {
              this.router.navigate(['/home']);
            },1000);
          }
        },
        error: (error: HttpErrorResponse) => {
          if(error.status === 401) {
            console.log("Error 401");
            this.invalidCredentials.emit();
          }
          return throwError(() => error);
        }
      });
      
    }
    else if(this.signInForm.invalid){
      this.signInForm.markAllAsTouched();
      console.log("invalid");
    }
  }
}
