import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { BannersService } from 'src/app/services/banners/banners.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { EchoService } from 'src/app/services/echo/echo.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { formatBanners, formatCategories, formatCategoryProduct, formatProducts } from 'src/app/utilities/response-utils';
import { Category } from 'src/assets/models/categories';
import { CategoryProduct, Product } from 'src/assets/models/products';
import { Banner } from 'src/assets/models/sitedetails';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {  
  constructor(private bannersService: BannersService, private echo: EchoService, private categoryService: CategoriesService, private productsService: ProductsService) {}
  
  banners: Observable<Banner[]>;
  categories: Observable<Category[]>;
  products: CategoryProduct[] = [];


  @ViewChild(ToasterComponent) toaster: ToasterComponent; 

  ngOnInit(): void {
    this.productsService.getProductByCategory('cat6540ea8d7e68a').pipe(map((response: any) => formatCategoryProduct(response))).subscribe({
      next: (products: CategoryProduct[]) => {
        this.products = products;
        console.log(this.products)
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
      }
    })
    this.banners = this.bannersService.getBanners().pipe(map((response: any) => formatBanners(response)));
    this.categories = this.categoryService.getCategories().pipe(map((response: any) => formatCategories(response)));

    this.echo.listen('doraemon', 'SampleEvent', (data: any) => {
      this.toast('New notification', data.message)
    })
  }

  toast(title: string, msg: string): void {
    this.toaster.showToast(title, msg, 'default', '', "/login");
  }

  toastRand(): void {
    let toasts = [["Success!", "Item has been added to the cart."], ["Long content", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"], ["Short content", "kwan"]]
    let min = 0;
    let max = toasts.length;
    let rand = Math.floor(Math.random() * (max - min + 1) + min);
    let toastContent = toasts[rand]
    this.toast(toastContent[0], toastContent[1])
  }
}
