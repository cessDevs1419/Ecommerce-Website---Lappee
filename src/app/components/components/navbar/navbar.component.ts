import { Component, OnInit, Input, QueryList, ViewChildren, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
import { formatCategories, formatSubcategories } from 'src/app/utilities/response-utils';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {

  @Input() searchString: any;
  
  categories!: Observable<Category[]>;
  subcategories!: Observable<Subcategory[]>;
  @ViewChildren('categoryItems') categoryItems!: QueryList<ElementRef>;
  @ViewChild('modalBackground') modalBg!: ElementRef;
  lastToggled!: string;
  cartContents!: CartItem[];
  targetElement!: HTMLElement;
  //products!: any;
  
  // 3/23/2023 - use Renderer2 to handle clicks
  constructor(private CategoriesService: CategoriesService, 
              private SubcategoriesService: SubcategoriesService,
              private ProductsService: ProductsService,
              private renderer: Renderer2,
              private cart: CartService,
              public accountService: AccountsService,
              private router: Router,
              private csrfService: CsrfService) {
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

      /* this.router.events.subscribe((event: any) => {
        if(event instanceof NavigationEnd) {
          this.accountService.checkLoggedIn();
        }
      }) */
    }


  ngOnInit(): void {
    // get csrf token
    this.csrfService.getCsrfToken();

    // load JSONs
    this.categories = this.CategoriesService.getCategories().pipe(map((response: any) => formatCategories(response)));
    this.subcategories = this.CategoriesService.getCategories().pipe(map((response: any) => formatSubcategories(response)));
    this.cartContents = this.cart.getItems(); 

    this.accountService.getUser().subscribe({
      next: (response: any) => {
        console.log(response);
      }
    })

    this.accountService.checkLoggedIn();
    console.log("Logged In: " + this.accountService.getIsLoggedIn());
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

}
