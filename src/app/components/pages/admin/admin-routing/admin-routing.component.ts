import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { ModalComponent } from 'src/app/components/components/modal/modal.component';
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
      this.toaster.showToast('New Notification', data.message, 'default', '', )
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
  
  
}
