import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { UsersService } from 'src/app/services/users/users.service';
import { formatUser } from 'src/app/utilities/response-utils';
import { User } from 'src/assets/models/user';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.css']
})
export class ProfileBannerComponent {

  user: User = this.accountService.user;
  fullName: string = this.user.fname + " " + (this.user.mname ? this.user.mname : "") + " " + this.user.lname + " " + (this.user.suffix ? this.user.suffix : "");
  constructor(private accountService: AccountsService, private userService: UsersService) {}

  /*
  users!: Observable<User[]>;
  ngOnInit(): void {
    this.users = this.userService.getUsers().pipe(map((response: any) => formatUser(response)))
  }
  */
}
