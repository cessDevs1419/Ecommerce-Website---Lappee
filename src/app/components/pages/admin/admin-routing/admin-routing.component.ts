import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { ModalComponent } from 'src/app/components/components/modal/modal.component';
import { NotificationDropdownComponent } from 'src/app/components/components/notification-dropdown/notification-dropdown.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { CsrfService } from 'src/app/services/csrf/csrf.service';
import { EchoService } from 'src/app/services/echo/echo.service';

@Component({
  selector: 'app-admin-routing',
  templateUrl: './admin-routing.component.html',
  styleUrls: ['./admin-routing.component.css']
})
export class AdminRoutingComponent {
  @ViewChild(ToasterComponent) toaster: ToasterComponent;
  @ViewChild(NotificationDropdownComponent) notification: NotificationDropdownComponent;
  @ViewChild(Modal) modal: ModalComponent;

  titleColor: string = 'text-white';
  textColor: string = 'text-secondary';
  borderColor: string = '';
  backGround: string = '';
  btncolor: string = 'btn-primary glow-primary'
  size: string = 'w-100';
  
  constructor(private echo: EchoService,     
  private accountService: AccountsService,
  private router: Router){
  
  }

  ngOnInit(): void{
    // this.echo.listen('channel-name', 'SampleEvent', (data: any) => {
    //   this.toaster.showToast('New Notification', data.message, 'default', '', )
    // })

    this.echo.listen('admin.notifications.orders', 'OrderStatusAlert', (data: any) => {
      this.toaster.showToast('Order Status Alert', data.message, this.type(data.type), '', )
    })
    this.echo.listen('admin.notifications.orders.placed', 'OrderPlaced', (data: any) => {
      this.toaster.showToast('New Order', data.message, this.type(data.type), '', )
    })
    this.echo.listen('admin.notifications.orders.cancelled', 'OrderCancelled', (data: any) => {
      this.toaster.showToast('Cancelled Order', data.message, this.type(data.type), '', )
    })
    this.echo.listen('admin.notifications.orders.unattended.to-ship', 'ToShipOrdersDetected', (data: any) => {
      this.toaster.showToast('Unattended Orders Detected', data.message, this.type(data.type), '', )
    })
    this.echo.listen('admin.notifications.orders.unattended.to-pack', 'ToPackOrdersDetected', (data: any) => {
      this.toaster.showToast('Unattended Orders Detected', data.message, this.type(data.type), '', )
    })
    this.echo.listen('admin.notifications.orders.unattended.pending', 'PendingOrdersDetected', (data: any) => {
      this.toaster.showToast('Unattended Orders Detected', data.message, this.type(data.type), '', )
    })
  }
  
  logout(): void {
    this.accountService.logoutUser().subscribe({
      next: (response: any) => {
        console.log(response);
        this.accountService.checkLoggedIn().subscribe();
  
        this.router.navigate(['/home']);
        
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  type(type: string): string{
    let notificationType: string
    switch (type) {
      case 'alert':
        notificationType = 'alert';
        break;

      case 'unattended':
        notificationType = 'unattended';
        break;

      default:
        notificationType = 'default';
        break;
    }
    return notificationType
  }
  
  
}
