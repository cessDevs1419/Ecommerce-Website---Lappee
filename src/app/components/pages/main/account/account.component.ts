import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  toastContent!: string;
  toastHeader!: string;

  isSignIn: boolean = true;

  @ViewChild(ToastComponent) toast: ToastComponent;

  constructor(private cookieService: CookieService){
    
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
    this.toast.show();
  }
}
