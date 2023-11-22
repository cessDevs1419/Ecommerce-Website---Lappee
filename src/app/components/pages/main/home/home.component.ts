import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { BannersService } from 'src/app/services/banners/banners.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { DeliveryinfoService } from 'src/app/services/delivery/deliveryinfo.service';
import { EchoService } from 'src/app/services/echo/echo.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { filterDeliveryInfo, findDeliveryInfo, formatBanners, formatCategories, formatCategoryProduct, formatDeliveryInfo, formatProducts } from 'src/app/utilities/response-utils';
import { Category } from 'src/assets/models/categories';
import { DeliveryInfo } from 'src/assets/models/deliveryinfo';
import { CategoryProduct, Product } from 'src/assets/models/products';
import { Banner } from 'src/assets/models/sitedetails';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {  
  constructor(private bannersService: BannersService, private categoryService: CategoriesService, private productsService: ProductsService, private deliveryInfoService: DeliveryinfoService, private accountService: AccountsService, private bpo: BreakpointObserver) {}

  itemsPerPage: number = 4;
  
  banners: Observable<Banner[]>;
  categories: Observable<Category[]>;
  products: CategoryProduct[] = [];
  trending: CategoryProduct[] = [];

  isLoading: boolean = true;
  mode: string = "setup-reminder";

  infos!: Observable<DeliveryInfo[]>;
  isInfoRegistered!: boolean;
  isInfoSelected: boolean;
  filteredInfo!: Observable<DeliveryInfo[]>


  @ViewChild(ToasterComponent) toaster: ToasterComponent; 
  @ViewChild(ModalClientComponent) modal: ModalClientComponent;

  ngOnInit(): void {
    this.bpo.observe(['(min-width: 768px)']).subscribe((res: any) => {
      if(res.matches) {
       this.itemsPerPage = 4
      }

      else {
        this.itemsPerPage = 3
      }
    });

    this.productsService.getProducts().pipe(map((response: any) => formatCategoryProduct(response))).subscribe({
      next: (products: CategoryProduct[]) => {
        this.products = products;
        this.isLoading = false;
        console.log(this.products);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
      }
    })
    this.banners = this.bannersService.getBanners().pipe(map((response: any) => formatBanners(response)));
    this.categories = this.categoryService.getCategories().pipe(map((response: any) => formatCategories(response)));

    this.checkAddress();

    this.productsService.getProductsTrending().pipe(map((response: any) => formatCategoryProduct(response))).subscribe({
      next: (products: CategoryProduct[]) => {
        this.trending = products;
        this.isLoading = false;
      },
    });
  }

  checkAddress() {
    this.infos = this.deliveryInfoService.getDeliveryInfo().pipe(map((response: any) => formatDeliveryInfo(response)));
    this.accountService.checkLoggedIn().subscribe({
      next: (response: any) => {
        if(response) {
          this.accountService.getLoggedUser().subscribe({
            next: (response: any) => {
              findDeliveryInfo(response.user_id, this.infos).subscribe({
                next: (match: boolean) => {
                  if(match) {
                    console.log('has matching address')
                    this.isInfoRegistered = true;
                    this.filteredInfo = filterDeliveryInfo(response.user_id, this.infos);
                    this.filteredInfo.subscribe({
                      next: (info: DeliveryInfo[]) => {
                        if(info){
                          this.isInfoSelected = true;
                        }
                        else {
                          this.isInfoSelected = false;
                        }
                      }
                    });
                  }
                  else {
                    console.log('no matching address');
                    this.isInfoRegistered = false;
                    console.log("Reminder: " + sessionStorage.getItem('reminderShown'))
                    if(sessionStorage.getItem('reminderShown') !== 'true'){
                      setTimeout(() => {
                        this.setupReminderModal();
                      }, 3000);
                      sessionStorage.setItem('reminderShown', 'true');
                      
                    }
                  }
                },
                error: (err: HttpErrorResponse) => {
                  console.log(err)
                }
              })
            },
            error: (err: HttpErrorResponse) => {
              console.log(err)
            }
          });
        }
      }
    });
  }

  setupReminderModal(): void {
    this.modal.setupReminder();
    
  }

  toast(title: string, msg: string): void {
    this.modal.setupReminder();
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
