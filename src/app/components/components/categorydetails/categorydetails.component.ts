import { Component, Input, AfterViewInit } from '@angular/core';
import { Category, Subcategory } from 'src/assets/models/categories';
import { ProductsService } from '../../../services/products/products.service';
import { Product, ProductList } from 'src/assets/models/products';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-categorydetails',
  templateUrl: './categorydetails.component.html',
  styleUrls: ['./categorydetails.component.css']
})
export class CategorydetailsComponent {

  @Input() category!: Category;
  @Input() subcategory!: Observable<Subcategory[]>;
  filteredSubcategories?: Observable<Subcategory[]>;

  /* 
  stuff to do
  - filter by category.id
  
  */

  constructor() {}

  ngOnInit(): void {
    this.subcategory.pipe(map((subs: Subcategory[]) => {
      subs.forEach((subcat: Subcategory) => {
        //console.log(subcat.id, " | ", subcat.main_category_id, " | ", subcat.name);
      })
    }));

    this.filteredSubcategories = this.filterSubcategories(this.subcategory);
    /* console.log(this.subcategory);
    this.filteredSubcategories = this.subcategory.pipe(map((subs: Subcategory[]) => {
      subs.filter((subcat: Subcategory) => subcat.main_category === this.category.id);
    })); */

    if(!this.filteredSubcategories){
      //console.log(this.category.name + this.filteredSubcategories);
    }
  }

  private filterSubcategories(input: Observable<Subcategory[]>): Observable<Subcategory[]> {
    return input.pipe(map((subs: Subcategory[]) => {
      return subs.filter((subcat: Subcategory) => subcat.main_category_id === this.category.id);
      
    }));
  }
}
