import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  siteTitle: string = AppComponent.title;
  isAdminDashboard: boolean = false;
  
   constructor(private url: LocationStrategy,
                private router: Router) {}

  ngOnInit(): void {
    this.updateAdminDashboardFlag();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateAdminDashboardFlag();
      }
    });
  }

  updateAdminDashboardFlag(): void {
    const currentUrl = this.url.path();
    this.isAdminDashboard = currentUrl.includes('/admin');
    console.log("Is admin dashboard: " + this.isAdminDashboard + " | " + currentUrl);
  }
}
