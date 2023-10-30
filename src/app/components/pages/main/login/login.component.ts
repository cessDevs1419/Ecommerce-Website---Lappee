import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default"; 

  isSignIn: boolean = true;

  @ViewChild(ToasterComponent) toaster: ToasterComponent;

  constructor(private cookieService: CookieService, public accountService: AccountsService){
    
  }

  signInToggle(): void {
    this.isSignIn = true;
  }

  signUpToggle(): void {
    this.isSignIn = false;
  }

  loginSuccessToast(): void {
    this.toaster.showToast("Login successful!", "You are now logged in.", 'default');
  }

  invalidCredentialsToast(): void {
    
    this.toaster.showToast("Login failed.", "Your credentials may be incorrect.", 'negative');
  }
}
