import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryProduct, Product, ProductList } from 'src/assets/models/products';
import { Router } from '@angular/router';
import { SearchFilterPipe } from '../../pipes/search-filter.pipe';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
  constructor(private router: Router) {
  }

  Number = Number
  
  @Input() products!: Observable<CategoryProduct[]>;
  @Input() selfReload: boolean = false;
  
  productsArr: CategoryProduct[];
  
  ngOnInit(): void {
    this.products.subscribe({
      next: (response: CategoryProduct[]) => {
        this.productsArr = response;
        response.forEach((item) => console.log(item))
      }
    })

  }

  navigateRoute(url: string): void {
    console.log(url)
    if(this.selfReload){
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([url]);
      });
    }
    else {
      this.router.navigate([url])
    }
  }

  test(product: CategoryProduct): boolean {
    console.log(product.name ,product.discount);
    return product.discount ? true : false;
  }
}
