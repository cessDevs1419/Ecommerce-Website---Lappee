import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { ChatsComponent } from 'src/app/components/components/chats/chats.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { UsersService } from 'src/app/services/users/users.service';

import { formatBannedUser, formatUser } from 'src/app/utilities/response-utils';
import { BannedUser, User } from 'src/assets/models/user';


@Component({
    selector: 'app-admin-accounts',
    templateUrl: './admin-accounts.component.html',
    styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent implements OnInit {
    @ViewChild(ToastComponent) toast: ToastComponent;
    @ViewChild(ToasterComponent) toaster: ToasterComponent;
    @ViewChild(TableComponent) table: TableComponent;
    @ViewChild(ChatsComponent) chats: ChatsComponent;
    backdrop: string = 'true';
    toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  
    
    users!: Observable<User[]>;
    banned_users!: Observable<BannedUser[]>;
    bannedStatus: { [userId: string]: boolean } = {}; 
    
    active_users!: Observable<User[]>;
    private refreshData$ = new Subject<void>();
    private bannedUsersSubject = new BehaviorSubject<BannedUser[]>([]);
    banned_users$ = this.bannedUsersSubject.asObservable();
    
    modalTitle: string;
    modalBanAccounts: boolean;
    modalUnBanAccounts: boolean;
	constructor(
		private user_service: UsersService
	) {
    
	}
	
	ngOnInit(): void{
        this.refreshData$.pipe(
            startWith(undefined),
            switchMap(() => this.user_service.getbannedUsers()),
            map((response: any) => formatBannedUser(response)),
            tap((bannedUsers: BannedUser[]) => {
                this.bannedStatus = {};
                bannedUsers.forEach((bannedUser: BannedUser) => {
                    this.bannedStatus[bannedUser.user_id] = true;
                });
                this.bannedUsersSubject.next(bannedUsers); 
                //console.log("bannedStatus:", this.bannedStatus);
    
                if (this.selectedRowData) {
                    this.modalBanAccounts = !this.bannedStatus[this.selectedRowData.user_id];
                    this.modalUnBanAccounts = this.bannedStatus[this.selectedRowData.user_id];
                    if (this.bannedStatus[this.selectedRowData.user_id]) {
                        this.modalTitle = "UNBAN ACCOUNT";
                    } else {
                        this.modalTitle = "BAN ACCOUNT";
                    }
                }
            })
        ).subscribe();
    
        this.users = this.refreshData$.pipe(
            startWith(undefined),
            switchMap(() => this.user_service.getUsers()),
            map((response: any) => formatUser(response)),
            tap(() => {
                this.table.loaded()
            })
        );
	}
	
    refreshTableData(): void {
        this.refreshData$.next();
    }
    
    selectedRowData: any;
    
    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;

        // Update modalBanAccounts, modalUnBanAccounts, and modalTitle when rowData is available
        if (this.bannedStatus[this.selectedRowData.user_id]) {
            this.modalTitle = "Unban Account";
        } else {
            this.modalTitle = "Ban Account";
        }
        this.modalBanAccounts = !this.bannedStatus[this.selectedRowData.user_id];
        this.modalUnBanAccounts = this.bannedStatus[this.selectedRowData.user_id];
    }

    SuccessToast(value: any): void {
        this.toaster.showToast(value.head, value.sub, 'default', '', )
    }
    
    WarningToast(value: any): void {
        this.toaster.showToast(value.head, value.sub, 'warn', '', )
    }
    
    ErrorToast(value: any): void {
        this.toaster.showToast(value.head, value.sub, 'negative', '', )
    }
    
    
}
