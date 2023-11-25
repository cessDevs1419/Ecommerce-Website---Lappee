import { Component, OnInit, OnChanges,Input, QueryList, ViewChildren, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { Category, CategoryList } from 'src/assets/models/categories';
import { SubcategoriesService } from '../../../services/subcategories/subcategories.service';
import { Subcategory } from 'src/assets/models/categories';
import { ProductsService } from '../../../services/products/products.service';
import { CartItem, ProductList } from 'src/assets/models/products';
import { Observable, map } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { NavigationEnd, Router } from '@angular/router';
import { CsrfService } from 'src/app/services/csrf/csrf.service';
import { findDeliveryInfo, formatCategories, formatDeliveryInfo, formatSiteLogo, formatSubcategories } from 'src/app/utilities/response-utils';
import { User } from 'src/assets/models/user';
import { LocationStrategy } from '@angular/common';
import { SiteLogo } from 'src/assets/models/sitedetails';
import { SiteDetailsService } from 'src/app/services/site-details/site-details.service';
import { DeliveryInfo } from 'src/assets/models/deliveryinfo';
import { DeliveryinfoService } from 'src/app/services/delivery/deliveryinfo.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {

  @Input() searchString: any;
  
  Number = Number;
  categories!: Observable<Category[]>;
  subcategories!: Observable<Subcategory[]>;
  @ViewChildren('categoryItems') categoryItems!: QueryList<ElementRef>;
  @ViewChild('modalBackground') modalBg!: ElementRef;
  @ViewChild('offcanvas') offcanvas: ElementRef;
  lastToggled!: string;
  cartContents!: CartItem[];
  targetElement!: HTMLElement;
  loginState$: Observable<boolean>;
  currentUser: Observable<User> = this.accountService.getLoggedUser();

  infos!: Observable<DeliveryInfo[]> 
  isAdminDashboard: boolean = false;

  siteLogo: Observable<SiteLogo>;
  isInfoRegistered: boolean;
  setupDetailsResolved: boolean = false;
  
  // 3/23/2023 - use Renderer2 to handle clicks
  constructor(private CategoriesService: CategoriesService, 
              private SubcategoriesService: SubcategoriesService,
              private ProductsService: ProductsService,
              private renderer: Renderer2,
              private cart: CartService,
              public accountService: AccountsService,
              private router: Router,
              private csrfService: CsrfService,
              private url: LocationStrategy,
              private siteDetailsService: SiteDetailsService,
              private deliveryInfoService: DeliveryinfoService) {
      this.renderer.listen('window','click', (event) => {
      let categoryClicked = false;
      
      // set dropdownShown -> true if any dropdown is clicked
      this.categoryItems.forEach((item) => {
        if(event.target === item.nativeElement){
          categoryClicked = true;
          this.targetElement = event.target;
        }
      });

      if(categoryClicked){
        this.toggleColor(event);
      }
      else {
        this.clearColorBG();
      }
      });
    }


  ngOnInit(): void {
   
    // initialize csrf token 
    this.csrfService.init();

   /*  console.log("Is admin dashboard: " + this.url.path().includes('/admin') + " | " + this.url.path());
    if(this.url.path().includes('/admin')){
      this.isAdminDashboard = true;
    } */

    this.siteLogo = this.siteDetailsService.getSiteLogo().pipe(map((response: any) => formatSiteLogo(response)));
    this.updateAdminDashboardFlag();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateAdminDashboardFlag();
      }
    });

    // load JSONs
    let categoryList = this.CategoriesService.getCategories();
    this.categories = categoryList.pipe(map((response: any) => formatCategories(response)));
    this.subcategories = categoryList.pipe(map((response: any) => formatSubcategories(response)));
    this.cartContents = this.cart.getItems(); 
    this.accountService.checkLoggedIn().subscribe((status: boolean) => {
      console.log("Logged In: " + status)
      if(status){
        this.checkUserInfo()
      }
    });
  }

  ngOnChanges(): void {
    this.accountService.checkLoggedIn().subscribe((status: boolean) => {
      if(status){
        this.checkUserInfo();
      }
    });
    console.log('ngOnchanges');
  }

  checkUserInfo(): void {
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
                    this.setupDetailsResolved = true;
                  }
                  else {
                    console.log('no matching address')
                    this.isInfoRegistered = false;
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

  updateAdminDashboardFlag(): void {
    const currentUrl = this.url.path();
    this.isAdminDashboard = currentUrl.includes('/admin');
    console.log("Is admin dashboard: " + this.isAdminDashboard + " | " + currentUrl);
  }

  // color toggling for nav links and modal background
  toggleColor(event: Event): void {

    // new setter of class
    if(this.targetElement.innerText !== this.lastToggled && !this.targetElement.classList.contains('activeLink')){
      this.clearColorBG();
      this.targetElement.classList.add('activeLink');
      this.modalBg.nativeElement.style.display = 'block';
    }

    // set flags
    if(this.targetElement.innerText === this.lastToggled){
      this.lastToggled = "";
      this.clearColorBG();
    }
    else {
      this.lastToggled = this.targetElement.innerText;
    }

    //console.log("lastToggled:" + this.lastToggled)
  }

  // reset colors and modal bg
  clearColorBG(): void {
    this.modalBg.nativeElement.style.display = 'none';
    this.categoryItems.forEach((item) => {
      if(item.nativeElement.classList.contains('activeLink')){
        item.nativeElement.classList.remove('activeLink');
      }
    })
    this.lastToggled = "";
  }

  gotoaccount(): void {
    this.router.navigate(['/account']);
  }

  dismissOffcanvas(): void {
    console.log('offcanvas dismiss');
    console.log(this.offcanvas);
    let bsOffcavnas = bootstrap.Offcanvas.getInstance(this.offcanvas.nativeElement);
    bsOffcavnas?.toggle();
  }

  toggleOffcanvas(): void {
    let bsOffcavnas = bootstrap.Offcanvas.getOrCreateInstance(this.offcanvas.nativeElement);
    bsOffcavnas?.show()
  }
}
