import { Component, ViewChild } from '@angular/core';
import { Observable, Subject, map, startWith, switchMap, tap } from 'rxjs';
import { ChatsComponent } from 'src/app/components/components/chats/chats.component';
import { UsersService } from 'src/app/services/users/users.service';
import { formatUser } from 'src/app/utilities/response-utils';
import { User } from 'src/assets/models/user';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css']
})
export class AdminChatComponent {

  @ViewChild(ChatsComponent) chats: ChatsComponent;
  private refreshData$ = new Subject<void>();
  users!: Observable<User[]>;

  constructor(
		private user_service: UsersService
	) {
    
	}
  
	ngOnInit(): void{
    this.users = this.refreshData$.pipe(
        startWith(undefined),
        switchMap(() => this.user_service.getUsers()),
        map((response: any) => formatUser(response)),
        tap(() => {
            this.chats.loaded()
        })
    );
}

 
  refreshTableData(): void {
      this.refreshData$.next();
  }
}
