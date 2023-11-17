import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';

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

  constructor(private cookieService: CookieService, public accountService: AccountsService, private eh: ErrorHandlerService){
    
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

  loginErrorToast(error: HttpErrorResponse): void {
    this.toaster.showToast("Oops!", this.eh.handle(error), 'negative');
  }

  invalidCredentialsToast(): void {
    
    this.toaster.showToast("Oops!", "Your credentials are incorrect.", 'negative');
  }
}
