import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subcategory, SubcategoryList } from 'src/assets/models/subcategories';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { Product, ProductList } from 'src/assets/models/products';
import { ProductsService } from 'src/app/services/products/products.service';
import { formatProducts, filterProductsBySubcategory, formatSubcategories, filterSubcategories, productSortByName, productSortByPrice } from 'src/app/utilities/response-utils';
import { Observable, map, filter } from 'rxjs';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css']
})
export class SubcategoriesComponent {

  subcategoryId!: String;
  subcategories!: Observable<Subcategory[]>;
  subcategoryMatch?: Observable<Subcategory[]> | null;
  products!: Observable<Product[]>;
  productsFiltered!: Observable<Product[]>;
  sortOption: string = "name-normal";

  constructor(private route: ActivatedRoute, private subcategoryService: SubcategoriesService, private productsService: ProductsService) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((parameter: any) => { console.log(parameter['subcategoryId']) });
    this.subcategoryId = String(this.route.snapshot.paramMap.get('subcategoryId'));
    this.subcategories = this.subcategoryService.getSubcategories().pipe(map((response: any) => formatSubcategories(response)));
    this.subcategoryMatch = filterSubcategories((this.subcategoryId as string), this.subcategories);
    this.products = this.productsService.getProducts().pipe(map((response: any) => formatProducts(response)));
    this.productsFiltered = filterProductsBySubcategory((this.subcategoryId as string), this.products);

    this.productSort();
  }

  productSort() {
    let option = this.sortOption;

    switch(option){
      case 'name-normal': {
        this.productsFiltered = productSortByName(this.productsFiltered, "normal");
        break;
      }

      case 'name-inverse': {
        this.productsFiltered = productSortByName(this.productsFiltered, "inverse");
        break;
      }

      case 'price-asc': {
        this.productsFiltered = productSortByPrice(this.productsFiltered, "ascending");
        break;
      }

      case 'price-desc': {
        this.productsFiltered = productSortByPrice(this.productsFiltered, "descending");
        break;
      }

      default: {
        console.warn(option + ' not found');
        break;
      }
    }

    console.log(option);
  }
}
