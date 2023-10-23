import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { Observable, Subject, map, of, startWith, switchMap } from 'rxjs';
import { AdminNotification, AdminNotificationList } from 'src/assets/models/admin-notifications';
import { NotificationsService } from 'src/app/services/notfications-service/notifications.service';
import { formatNotificationsResponse } from 'src/app/utilities/response-utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  
  isClassToggled: boolean = false;
  toggleContent: boolean = false;
  toggleProduct: boolean = false;
  toggleOrder: boolean = false;
  ContentMenu: boolean = false;
  ProductMenu: boolean = false;
  OrderMenu: boolean = false;
  overviewClass: boolean = false;

  admin_bg: string = "admin-bg-dark";
  sidebar_bg: string = "sidebar-bg-dark";
  active_link: string = "active-link";
  active_link_icon: string = "active-link-icon";
  
  notifications: Observable<AdminNotification[]>;
  notificationsLength: Observable<AdminNotification[]>;

  toggleClass() {
    this.isClassToggled = !this.isClassToggled;
  }

  @Input() headerName: string;
  @Input() admin!: boolean;
  @Input() courier!: boolean;
  
  private refreshData$ = new Subject<void>();

  constructor(private router: Router,
    private notification_service: NotificationsService,
    private cdr: ChangeDetectorRef
    ) {

    }
  
  
  ngOnInit(): void{

    this.notifications = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.notification_service.getNotifications()),
      map((Response: any) => formatNotificationsResponse(Response))
    );

  }


  closeContent(){
    this.ContentMenu = false
    this.toggleContent = false
  }
  
  closeFile(){
    this.ProductMenu = false
    this.toggleProduct = false
  }
  
  closeAllMenu(){
    this.ContentMenu = false
    this.toggleContent = false
    this.ProductMenu = false
    this.toggleProduct = false
    this.overviewClass = true
    console.log(this.overviewClass )
  }
  
  
  showContent(){
    this.ContentMenu = true
    this.toggleContent = true
    this.router.navigate(['/admin/site-settings']);
    this.closeFile()
  }
  
  showProduct(){
    this.ProductMenu = true
    this.toggleProduct = true

    this.router.navigate(['/admin/attribute-management']);
    this.closeContent()
  }
  
  showOrders(){
    this.ProductMenu = true
    this.toggleProduct = true

    this.router.navigate(['/admin/order-management']);
    this.closeContent()
  }
  
  isOverviewActive(): boolean {
    return this.router.url === '/admin/overview';
  }
  
  isManageProductActive(): boolean {
    return (
      this.router.url === '/admin/attribute-management' ||
      this.router.url === '/admin/category-management' ||
      this.router.url === '/admin/product-management' ||
      this.router.url === '/admin/product-management/product/add' 
    );
  }
  
  isManageOrderActive(): boolean {
    return (
      this.router.url === '/admin/order-management' ||
      this.router.url === '/admin/order-management'
    );
  }
  
  isManageContentActive(): boolean {
    return (
      this.router.url === '/admin/site-settings' ||
      this.router.url === '/admin/manage-about-us' ||
      this.router.url === '/admin/manage-tos' ||
      this.router.url === '/admin/site-settings/add'
    );
  }
  
  isManageSalesReportActive(): boolean {
    return this.router.url === '/admin/sales-management' 
  }
  
  isManageInquiriesActive(): boolean {
    return this.router.url === '/admin/inquiry' 
  }
  
  isManageAccountsActive(): boolean {
    return this.router.url === '/admin/accounts-management'
  }
  
  
  isSiteSettingsActive(): boolean {
    return (this.router.url === '/admin/site-settings'||
    this.router.url === '/admin/site-settings/add');
  }
  isAboutSiteActive(): boolean {
    return this.router.url === '/admin/manage-about-us';
  }
  isTermsSiteActive(): boolean {
    return this.router.url === '/admin/manage-tos';
  }

  refreshTableData(): void {
      this.refreshData$.next();
  }

  calculateUnreadCount(items: AdminNotification[]): boolean {
    return items.some(item => !item.is_read);
  }
  getNotifationData(data: any){
      switch(data.type){
        case 'order':
          this.router.navigate(['/admin/order-management']);
        break;
      }
      
      this.notification_service.patchNotifications(data.id).subscribe({
          next: async(response: any) => { 
            this.refreshTableData();
          },
          error: (error: HttpErrorResponse) => {
    
          }
    
      });
  }
}
