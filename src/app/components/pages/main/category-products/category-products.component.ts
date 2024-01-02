import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { formatCategoryProduct, formatProducts, productSortByName, productSortByPrice } from 'src/app/utilities/response-utils';
import { CategoryProduct, Product } from 'src/assets/models/products';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent {
  
  categorySubscription!: Subscription;
  categoryId!: string;
  products!: Observable<CategoryProduct[]>;
  productsFiltered!: Observable<CategoryProduct[]>;
  sortOption: string = "name-normal";

  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService, private productsService: ProductsService) {}

  ngOnInit() {
    this.categorySubscription = this.route.params.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.filterProducts();
    })    
  }

  filterProducts(): void{
    this.products = this.productsService.getProductByCategory(this.categoryId).pipe(map((response: any) => formatCategoryProduct(response)));
    this.productSort();
  }

  productSort(): void {
    let option = this.sortOption;

    switch(option){
      case 'name-normal': {
        this.productsFiltered = productSortByName(this.products, "normal");
        break;
      }

      case 'name-inverse': {
        this.productsFiltered = productSortByName(this.products, "inverse");
        break;
      }

      case 'price-asc': {
        this.productsFiltered = productSortByPrice(this.products, "ascending");
        break;
      }

      case 'price-desc': {
        this.productsFiltered = productSortByPrice(this.products, "descending");
        break;
      }

      default: {
        console.warn(option + ' not found');
        break;
      }
    }

   // console.log(option);
  }
}
