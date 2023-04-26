import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductList } from 'src/assets/models/products';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {

  @Input() products!: Observable<Product[]>;

}
