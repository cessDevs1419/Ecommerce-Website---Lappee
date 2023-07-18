import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';

import { formatBannedUser, formatUser } from 'src/app/utilities/response-utils';
import { BannedUser, User } from 'src/assets/models/user';

@Component({
    selector: 'app-admin-accounts',
    templateUrl: './admin-accounts.component.html',
    styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent {

    users!: Observable<User[]>;
    banned_users!: Observable<BannedUser[]>;
    bannedStatus: { [userId: string]: boolean } = {}; 
    
    active_users!: Observable<User[]>;
    private refreshData$ = new Subject<void>();
    private bannedUsersSubject = new BehaviorSubject<BannedUser[]>([]);
    banned_users$ = this.bannedUsersSubject.asObservable();
    

	constructor(
		private user_service: UsersService
	) {
    
	}
	
	ngOnInit(): void{
        this.refreshData$.pipe(
            startWith(undefined),
            switchMap(() => this.user_service.getbannedUsers()),
            map((Response: any) => formatBannedUser(Response)),
            tap((bannedUsers: BannedUser[]) => {
              this.bannedStatus = {};
              bannedUsers.forEach((bannedUser: BannedUser) => {
                this.bannedStatus[bannedUser.user_id] = true;
              });
              this.bannedUsersSubject.next(bannedUsers); // Update the BehaviorSubject
              console.log("bannedStatus:", this.bannedStatus);
            })
          ).subscribe();
        
          this.users = this.refreshData$.pipe(
            startWith(undefined),
            switchMap(() => this.user_service.getUsers()),
            map((response: any) => formatUser(response)),
            // No need to set the banned status here since we are doing it in the banned_users Observable
          );

	}
	
    refreshTableData(): void {
        this.refreshData$.next();
    }
    
    selectedRowData: any;
    
    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
        
    }


}
