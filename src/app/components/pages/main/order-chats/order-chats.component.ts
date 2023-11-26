import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, filter, map, of, startWith, switchMap, tap } from 'rxjs';
import { ChatsComponent } from 'src/app/components/components/chats/chats.component';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { formatChats } from 'src/app/utilities/response-utils';
import { Chats } from 'src/assets/models/chats';

@Component({
  selector: 'app-order-chats',
  templateUrl: './order-chats.component.html',
  styleUrls: ['./order-chats.component.css']
})
export class OrderChatsComponent {

  @ViewChild(ChatsComponent) chats: ChatsComponent;
  private refreshData$ = new Subject<void>();
  chatsList!: Observable<Chats[]>;
  order_id: string = ''
  constructor(
    private chatsService: ChatsService,
    private route: ActivatedRoute
	) {
    
	}
  ngOnInit(): void{

    this.route.paramMap.subscribe((params) => {
			const id = params.get('id');
      this.order_id = id !== null ? id : ''; 
		});
  }
  refreshTableData(): void {
    this.refreshData$.next();
  }
}
