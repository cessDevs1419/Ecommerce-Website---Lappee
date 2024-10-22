import { ChangeDetectorRef,  Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { Observable, Subject, filter, map, of, startWith, switchMap, tap } from 'rxjs';
import { AdminNotification, AdminNotificationList } from 'src/assets/models/admin-notifications';
import { NotificationsService } from 'src/app/services/notfications-service/notifications.service';
import { formatNotificationsResponse } from 'src/app/utilities/response-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { EchoService } from 'src/app/services/echo/echo.service';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';
import { SalesStatisticsService } from 'src/app/services/sales-overview/sales-statistics.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild(NotificationDropdownComponent) notifs: NotificationDropdownComponent;
  @Output() warn: EventEmitter<any> = new EventEmitter();
  isClassToggled: boolean = false;
  toggleContent: boolean = false;
  toggleProduct: boolean = false;
  toggleOrder: boolean = false;
  ContentMenu: boolean = false;
  ProductMenu: boolean = false;
  OrderMenu: boolean = false;
  overviewClass: boolean = false;
  salesHeader: boolean = false;
  salesProductTitle: string;
  from: string;
  to: string;
  admin_bg: string = "admin-bg-dark";
  header_bg: string = "admin-bg-dark";
  sidebar_bg: string = "sidebar-bg-dark";
  active_link: string = "active-link";
  active_link_icon: string = "active-link-icon";
  
  notifications: Observable<AdminNotification[]>;
  notificationsLength: Observable<AdminNotification[]>;
  notif: boolean = false;
  link: string
  id: string
  toggleClass() {
    this.isClassToggled = !this.isClassToggled;
  }
  
  
  @Output() confirm: EventEmitter<any>
  @Input() headerName: string;
  @Input() admin!: boolean;
  @Input() courier!: boolean;
  
  private refreshData$ = new Subject<void>();
  constructor(private router: Router,
    private notification_service: NotificationsService,
    private cdr: ChangeDetectorRef,
    private echo: EchoService,
    private route: ActivatedRoute,
    private sales: SalesStatisticsService,
    ) {

    }
  
  
  ngOnInit(): void{

    // this.echo.listen('channel-name', 'SampleEvent', (data: any) => {
    // })
    
    this.notifications = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.notification_service.getNotifications()),
      map((Response: any) => formatNotificationsResponse(Response)),
      tap(() => {
        this.notifs.loaded()
      })
    );
    
 
    this.echo.listen('admin.notifications.orders', 'OrderStatusAlert', (data: any) => {
      this.refreshTableData()
    })
    this.echo.listen('admin.notifications.orders.placed', 'OrderPlaced', (data: any) => {
      this.refreshTableData()
    })
    this.echo.listen('admin.notifications.orders.cancelled', 'OrderCancelled', (data: any) => {
      this.refreshTableData()
    })
    this.echo.listen('admin.notifications.orders.unattended.to-ship', 'ToShipOrdersDetected', (data: any) => {
      this.refreshTableData()
    })
    this.echo.listen('admin.notifications.orders.unattended.to-pack', 'ToPackOrdersDetected', (data: any) => {
      this.refreshTableData()
    })
    this.echo.listen('admin.notifications.orders.unattended.pending', 'PendingOrdersDetected', (data: any) => {
      this.refreshTableData()
    })
    
		this.route.paramMap.subscribe((params) => {
			const page = params.get('page');
			const action = params.get('action');
			const id = params.get('id') || null;
      
		});

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === '/admin/sales-management' || this.router.url.startsWith('/admin/product-statistics/')) {
        this.salesHeader = true;
      } else {
        this.salesHeader = false;
      }
    });

    if (this.router.url === '/admin/sales-management' || this.router.url.startsWith('/admin/product-statistics/')) {
      this.salesHeader = true;
    } else {
      this.salesHeader = false;
    }
    
    this.sales.triggerFunction$.subscribe((data: any) => {
      this.formatHeader(data);
    });

    this.sales.triggerLink$.subscribe((data: any) => {
      this.link = data
      
    });
  }



  formatHeader(data: any){
    this.salesProductTitle = data.title
    this.from = data.from
    this.to = data.to
  }

  openTab(link: string){
    if(link){
      window.open(link)
    }else{
      console.log('wala')
      const report = {
        head: 'Generate Reports',
        sub: 'No Reports Available'
      }
      this.warn.emit(report)
    }
   
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
  }
  
  showAccounts(){
    this.ContentMenu = true
    this.toggleContent = true
    this.router.navigate(['/admin/accounts-management-admins']);
    this.closeFile()
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
      this.router.url === '/admin/stocks-management' ||
      this.router.url === '/admin/discounts-management' ||
      this.router.url === '/admin/product-management/product/add' || 
      this.router.url.startsWith('/admin/product-management/product/edit') ||
      this.router.url.startsWith('/admin/product-management/variant/edit')
    );
  }
  
  isManageOrderActive(): boolean {
    return (
      this.router.url === '/admin/order-management' ||
      this.router.url === '/admin/order-packed'||
      this.router.url === '/admin/order-ship'||
      this.router.url === '/admin/order-shipping'||
      this.router.url === '/admin/order-delivered'||
      this.router.url === '/admin/order-cancel'||
      this.router.url === '/admin/order-cancelled'||
      this.router.url === '/admin/order-on-hold'||
      this.router.url === '/admin/order-return'
    );
  }
  
  isManageContentActive(): boolean {
    return (
      this.router.url === '/admin/site-settings' ||
      this.router.url === '/admin/manage-about-us' ||
      this.router.url === '/admin/manage-tos' ||
      this.router.url === '/admin/site-settings/add'||
      this.router.url === '/admin/manage-hold-deny-reasons'||
      this.router.url === '/admin/manage-product-group' ||
      this.router.url === '/admin/manage-shipping-fee'||
      this.router.url === '/admin/manage-size-charts'
    );
  }
  
  isManageSalesReportActive(): boolean {

    return (
      this.router.url === '/admin/sales-management' || 
      this.router.url.startsWith('/admin/product-statistics')
    )
  }
  
  isManageInquiriesActive(): boolean {
    return this.router.url === '/admin/inquiry' 
  }
  
  isManageAccountsActive(): boolean {
    return (
      this.router.url === '/admin/accounts-management-admins' ||
      this.router.url === '/admin/accounts-management-users' ||
      this.router.url === '/admin/accounts-management-customers'
    )
  }
  isChatsActive(): boolean {
    return this.router.url === '/admin/chats' ||
    this.router.url.startsWith('/admin/chats')
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
  isReasonSiteActive(): boolean {
    return this.router.url === '/admin/manage-hold-deny-reasons';
  }

  isGroupSiteActive(): boolean {
    return this.router.url === '/admin/manage-product-group';
  }

  isShippingSiteActive(): boolean {
    return this.router.url === '/admin/manage-shipping-fee';
  }

  isSizeCharts(): boolean {
    return this.router.url === '/admin/manage-size-charts';
  }
  isAdminAccountsActive(): boolean {
    return this.router.url === '/admin/accounts-management-admins';
  }
  isUsersAccountsActive(): boolean {
    return this.router.url === '/admin/accounts-management-users';
  }
  isCustomersAccountsActive(): boolean {
    return this.router.url === '/admin/accounts-management-customers';
  }

  refreshTableData(): void {
      this.refreshData$.next();
  }
  


  calculateUnreadCount(items: AdminNotification[]): boolean {
    return items.some(item => !item.is_read);
  }
  getNotifationData(data: any){
      switch(data.type){
        case 'alert':
          this.router.navigate(['/admin/order-management']);
        break;
        default:
          this.router.navigate(['/admin/order-management']);
      }
      
      this.notification_service.patchNotifications(data.id).subscribe({
          next: async(response: any) => { 
            this.refreshTableData();
          },
          error: (error: HttpErrorResponse) => {
    
          }
    
      });
  }
  getAllNotifationIds(data: any){

    this.notification_service.patchMarkAllReadNotifications().subscribe({
      next: async(response: any) => { 
        this.refreshTableData();
      },
      error: (error: HttpErrorResponse) => {

      }

  });
  }

  
}
