import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { BannersService } from 'src/app/services/banners/banners.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { EchoService } from 'src/app/services/echo/echo.service';
import { formatBanners, formatCategories } from 'src/app/utilities/response-utils';
import { Category } from 'src/assets/models/categories';
import { Banner } from 'src/assets/models/sitedetails';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {  
  constructor(private bannersService: BannersService, private echo: EchoService, private categoryService: CategoriesService) {}
  
  banners: Observable<Banner[]>;
  categories: Observable<Category[]>

  @ViewChild(ToasterComponent) toaster: ToasterComponent; 

  ngOnInit(): void {
    this.banners = this.bannersService.getBanners().pipe(map((response: any) => formatBanners(response)));
    this.categories = this.categoryService.getCategories().pipe(map((response: any) => formatCategories(response)));

    this.echo.listen('doraemon', 'SampleEvent', (data: any) => {
      this.toast('New notification', data.message)
    })
  }

  toast(title: string, msg: string): void {
    this.toaster.showToast(title, msg, 'default', '', "/login");
  }
}
