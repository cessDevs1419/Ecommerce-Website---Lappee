import { Component, OnInit, Input, QueryList, ViewChildren, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { Category, CategoryList } from 'src/assets/models/categories';
import { SubcategoriesService } from '../../../services/subcategories/subcategories.service';
import { SubcategoryList, Subcategory } from 'src/assets/models/subcategories';
import { ProductsService } from '../../../services/products/products.service';
import { CartItem, ProductList } from 'src/assets/models/products';
import { Observable, map } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { AccountsService } from 'src/app/services/accounts/accounts.service';


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
              public accountService: AccountsService) {
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
    // load JSONs
    this.categories = this.CategoriesService.getCategories().pipe(map((response: any) => this.formatCategories(response)));
    this.subcategories = this.SubcategoriesService.getSubcategories().pipe(map((response: any) => this.formatSubcategories(response)));
    console.log(this.subcategories);
    this.cartContents = this.cart.getItems(); 
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

    console.log("lastToggled:" + this.lastToggled)
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

  private formatSubcategories(response: SubcategoryList) : Subcategory[] {
    return response.data.map((data: Subcategory) => ({
      id: data.id,
      main_category: data.main_category,
      name: data.name
    }));
  }

  private formatCategories(response: CategoryList) : Category[] {
    return response.data.map((data: Category) => ({
      id: data.id,
      name: data.name
    }));
  }
}
