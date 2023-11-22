import { LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-main-routing',
  templateUrl: './main-routing.component.html',
  styleUrls: ['./main-routing.component.css']
})
export class MainRoutingComponent {
  pageFlag: boolean = false

  constructor(private router: Router
    , private url: LocationStrategy){

  }
  ngOnInit(): void{
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateAdminDashboardFlag();
      }
    });
    
  }
  updateAdminDashboardFlag(): void {
    const currentUrl = this.url.path();
    this.pageFlag = !currentUrl.includes('/admin');
  }
}
