import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default"; 

  isSignIn: boolean = true;

  @ViewChild(ToastComponent) toast: ToastComponent;

  constructor(private cookieService: CookieService, public accountService: AccountsService){
    
  }

  signInToggle(): void {
    this.isSignIn = true;
  }

  signUpToggle(): void {
    this.isSignIn = false;
  }

  registerSuccessToast(): void {
    this.toastHeader = "Registration successful!";
    this.toastContent = "You may now login using your account.";
    this.toast.switchTheme('default');
    this.toast.show();
  }

  loginSuccessToast(): void {
    this.toastHeader = "Login successful!";
    this.toastContent = "You are now logged in.";
    this.toast.switchTheme('default');
    this.toast.show();
  }

  invalidCredentialsToast(): void {
    this.toastHeader = "Login unsuccessful.";
    this.toastContent = "Your credentials may be incorrect.";
    this.toast.switchTheme('negative');
    this.toast.show();
    //console.log(this.toastTheme);
  }
}
