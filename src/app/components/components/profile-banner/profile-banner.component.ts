import { Component } from '@angular/core';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { User } from 'src/assets/models/user';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.css']
})
export class ProfileBannerComponent {

  user: User = this.accountService.user;
  fullName: string = this.user.fname + " " + (this.user.mname ? this.user.mname : "") + " " + this.user.lname + " " + (this.user.suffix ? this.user.suffix : "");
  constructor(private accountService: AccountsService) {}
}
