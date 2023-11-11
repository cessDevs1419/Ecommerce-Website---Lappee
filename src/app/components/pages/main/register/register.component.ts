import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { OutlineCircleSpinnerComponent } from 'src/app/components/components/loader/general/outline-circle-spinner/outline-circle-spinner/outline-circle-spinner.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default"; 

  isSignIn: boolean = true;

  lastEmail: string = '';
  registerDone: boolean = false;

  @ViewChild(ToasterComponent) toaster: ToasterComponent;

  constructor(private cookieService: CookieService, public accountService: AccountsService){
    
  }

  signInToggle(): void {
    this.isSignIn = true;
  }

  signUpToggle(): void {
    this.isSignIn = false;
  }

  registerSuccessToast(email: string): void {
    this.lastEmail = email;
    this.registerDone = true;

    // this.toastHeader = "Registration successful!";
    // this.toastContent = "You may now login using your account.";
    // this.toast.switchTheme('default');
    // this.toast.show();
  }

}
