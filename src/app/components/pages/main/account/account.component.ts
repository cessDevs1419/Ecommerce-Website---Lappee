import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  isSignIn: boolean = true;

  signInToggle(): void {
    this.isSignIn = true;
  }

  signUpToggle(): void {
    this.isSignIn = false;
  }
}
