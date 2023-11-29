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
  constructor(private router: Router) {}
  
  @Input() searchString : any;
  @Input() products!: Observable<CategoryProduct[]>;
  @Input() selfReload: boolean = false;
  
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
}
