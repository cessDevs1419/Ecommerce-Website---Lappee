import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { SiteDetailsService } from 'src/app/services/site-details/site-details.service';
import { formatSiteDetails } from 'src/app/utilities/response-utils';
import { SiteDetails } from 'src/assets/models/sitedetails';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  siteTitle: Observable<SiteDetails>;
  isAdminDashboard: boolean = false;
  
   constructor(private url: LocationStrategy,
                private router: Router,
                public siteDetailsService: SiteDetailsService) {}

  ngOnInit(): void {
    this.updateAdminDashboardFlag();
    this.siteTitle = this.siteDetailsService.getSiteDetails().pipe(map((response:any) => formatSiteDetails(response)));
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
