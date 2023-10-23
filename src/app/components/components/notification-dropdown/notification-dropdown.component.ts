import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsService } from 'src/app/services/notfications-service/notifications.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.css']
})
export class NotificationDropdownComponent {

  @Output() getNotifationData: EventEmitter<any> = new EventEmitter();
  @Input() data: Observable<any[]>;
  
  bg_dark: string = 'bg-notification-dark'
  font_dark: string = 'text-white'
  font_dark_subtle: string = 'text-notification-grey'

  // Sampledata: any = 
  // [
  //   {
  //     type: 'order',
  //     active: true,
  //     message: 'Wendell Ravago placed an order on item Zipp Hoodie',
  //     created: new Date('2023-10-23T08:25:00Z'), 
  //   },
  //   {
  //     type: 'product',
  //     active: false,
  //     message: 'Wendell Ravago placed an order on item Tae Hoodie',
  //     created: new Date('2023-10-21T10:00:00Z'), 
  //   },
  //   {
  //     type: 'product',
  //     active: false,
  //     message: 'Wendell Ravago placed an order on item Tae Hoodie',
  //     created: new Date('2023-09-01T10:00:00Z'), 
  //   },
  //   {
  //     type: 'product',
  //     active: false,
  //     message: 'Wendell Ravago placed an order on item Tae Hoodie',
  //     created: new Date('2022-09-01T10:00:00Z'), 
  //   },
  // ];
  todayItems: any[] = [];
  earlierThisWeekItems: any[] = [];

  constructor(
    private router: Router
  ) {
    
    
  }

  ngOnInit(){
    this.data.subscribe((items) => {
      const today = new Date();
      
      this.todayItems = []
      this.earlierThisWeekItems = []

      items.forEach((item) => {
        const createdDate = new Date(item.created_at);
        const timeDifference = today.getTime() - createdDate.getTime();
        const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
        if (daysAgo === 0) {
          this.todayItems.push(item);
        } else if (daysAgo <= 7) {
          this.earlierThisWeekItems.push(item);
        }
      });
    });
  }
  
  getRelativeTime(createdDate: string): string {
    const now = new Date();
    const createdDateObj = new Date(createdDate);
    const timeDifference = now.getTime() - createdDateObj.getTime();
    const secondsAgo = Math.floor(timeDifference / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const weeksAgo = Math.floor(daysAgo / 7);
    const monthsAgo = Math.floor(weeksAgo / 4);
    const yearsAgo = Math.floor(monthsAgo / 12);
  
    switch (true) {
      case yearsAgo > 0:
        return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
      case monthsAgo > 0:
        return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
      case weeksAgo > 0:
        return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
      case daysAgo > 0:
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
      case hoursAgo > 0:
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
      case minutesAgo > 0:
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
      case secondsAgo > 0:
        return `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
      default:
        return 'just now';
    }
  }
  
  route(id:string, type:string){

    const data = {
      id: id,
      type: type
    }
    
    this.getNotifationData.emit(data)
  }

}
