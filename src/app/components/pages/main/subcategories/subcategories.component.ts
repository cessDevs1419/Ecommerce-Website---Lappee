import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subcategory } from 'src/assets/models/categories';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { Product, ProductList } from 'src/assets/models/products';
import { ProductsService } from 'src/app/services/products/products.service';
import { formatProducts, filterProductsBySubcategory, formatSubcategories, filterSubcategories, productSortByName, productSortByPrice } from 'src/app/utilities/response-utils';
import { Observable, map, filter, Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { CategoriesService } from 'src/app/services/categories/categories.service';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css']
})
export class SubcategoriesComponent {

  subcategorySubscription!: Subscription;
  subcategoryId!: String;
  subcategories!: Observable<Subcategory[]>;
  subcategoryMatch?: Observable<Subcategory[]> | null;
  products!: Observable<Product[]>;
  productsFiltered!: Observable<Product[]>;
  sortOption: string = "name-normal";

  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService, private productsService: ProductsService) {}

  ngOnInit() {
    this.subcategorySubscription = this.route.params.subscribe(params => {
      this.subcategoryId = params['subcategoryId'];
      this.filterProducts();
    })    
  }

  filterProducts(): void{
    this.subcategories = this.categoriesService.getCategories().pipe(map((response: any) => formatSubcategories(response)));
    
    this.subcategoryMatch = filterSubcategories((this.subcategoryId as string), this.subcategories);
    this.products = this.productsService.getProducts().pipe(map((response: any) => formatProducts(response)));
    this.productsFiltered = filterProductsBySubcategory((this.subcategoryId as string), this.products);
    this.productSort();
  }

  productSort(): void {


    // let option = this.sortOption;

    // switch(option){
    //   case 'name-normal': {
    //     this.productsFiltered = productSortByName(this.productsFiltered, "normal");
    //     break;
    //   }

    //   case 'name-inverse': {
    //     this.productsFiltered = productSortByName(this.productsFiltered, "inverse");
    //     break;
    //   }

    //   case 'price-asc': {
    //     this.productsFiltered = productSortByPrice(this.productsFiltered, "ascending");
    //     break;
    //   }

    //   case 'price-desc': {
    //     this.productsFiltered = productSortByPrice(this.productsFiltered, "descending");
    //     break;
    //   }

    //   default: {
    //     console.warn(option + ' not found');
    //     break;
    //   }
    // }

    // console.log(option);
  }
  
  
  
}
