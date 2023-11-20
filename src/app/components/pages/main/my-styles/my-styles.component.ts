import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as bootstrap from 'bootstrap';
import { Observable, map } from 'rxjs';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';
import { ProductsService } from 'src/app/services/products/products.service';
import { formatCategoryProduct, formatProductObj, formatProducts } from 'src/app/utilities/response-utils';
import { CategoryProduct, Product } from 'src/assets/models/products';

@Component({
  selector: 'app-my-styles',
  templateUrl: './my-styles.component.html',
  styleUrls: ['./my-styles.component.css']
})
export class MyStylesComponent {

  constructor(private productsService: ProductsService, public domSanitizer: DomSanitizer) {}
  
  products: Observable<CategoryProduct[]>
  //selectedProduct: Product;
  selectedProduct1: Product;
  selectedProduct2: Product;
  @ViewChild('carousel') carousel: ElementRef;
  @ViewChild(ModalClientComponent) modal: ModalClientComponent;

  mode: string = "";


  product1Select = new FormGroup({
    product1: new FormControl('', Validators.required),
    variant1: new FormControl('', Validators.required)
  })

  product2Select = new FormGroup({
    product2: new FormControl('', Validators.required),
    variant2: new FormControl('', Validators.required)
  })

  get product1() { return this.product1Select.get('product1') }
  get product2() { return this.product2Select.get('product2') }

  ngOnInit(): void {
    this.products = this.productsService.getProducts().pipe(map((response: any) => formatCategoryProduct(response)));

    setTimeout(() => {
      this.showPrimer();
    }, 3000)
  }

  showPrimer(): void {
    this.modal.myStylesPrimer();
  }

  selectProduct1(product: CategoryProduct) {
    console.log(product);
    this.productsService.getProductDetails(product.product_id).pipe(map((response: any) => formatProductObj(response))).subscribe({
      next: (response: any) => {
        this.selectedProduct1 = response;
      }
    });
  }

  selectProduct2(product: CategoryProduct) {
    console.log(product);
    this.productsService.getProductDetails(product.product_id).pipe(map((response: any) => formatProductObj(response))).subscribe({
      next: (response: any) => {
        this.selectedProduct2 = response;
      }
    });
  }

  validatePage1(): void {
    if(this.product1Select.valid){
      this.nextPage();
    }
    else {
      this.product1Select.markAllAsTouched();
    }
  }

  nextPage(): void {
    let instance = new bootstrap.Carousel(this.carousel.nativeElement);
    instance.next();
  }

  prevPage(): void {
    let instance = new bootstrap.Carousel(this.carousel.nativeElement);
    instance.prev();
  }
}
