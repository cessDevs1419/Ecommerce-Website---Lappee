import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { OutlineCircleSpinnerComponent } from 'src/app/components/components/loader/general/outline-circle-spinner/outline-circle-spinner/outline-circle-spinner.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default"; 

  lastEmail: string = '';
  registerDone: boolean = false;

  @ViewChild(ToasterComponent) toaster: ToasterComponent;

  constructor(private cookieService: CookieService, public accountService: AccountsService, private eh: ErrorHandlerService){
    
  }

  registerSuccessToast(email: string): void {
    this.lastEmail = email;
    this.registerDone = true;

    // this.toastHeader = "Registration successful!";
    // this.toastContent = "You may now login using your account.";
    // this.toast.switchTheme('default');
    // this.toast.show();
  }

  registerFailedToast(error: HttpErrorResponse): void {
    this.toaster.showToast("Oops!", this.eh.handle(error), 'negative')
  }

}
