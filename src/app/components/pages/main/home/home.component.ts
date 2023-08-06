import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BannersService } from 'src/app/services/banners/banners.service';
import { formatBanners } from 'src/app/utilities/response-utils';
import { Banner } from 'src/assets/models/sitedetails';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private bannersService: BannersService) {}
  
  banners: Observable<Banner[]>;

  ngOnInit(): void {
    this.banners = this.bannersService.getBanners().pipe(map((response: any) => formatBanners(response)));
  }
}
