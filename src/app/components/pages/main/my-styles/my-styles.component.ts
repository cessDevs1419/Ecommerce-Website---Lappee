import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as bootstrap from 'bootstrap';
import { Observable, map } from 'rxjs';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';
import { ProductsService } from 'src/app/services/products/products.service';
import { formatCategoryProduct, formatProductObj, formatProducts } from 'src/app/utilities/response-utils';
import { CategoryProduct, Product, Variant } from 'src/assets/models/products';

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
  selectedVariant1: Variant;
  selectedVariant2: Variant;
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
  get variant1() { return this.product1Select.get('variant1') }
  get variant2() { return this.product2Select.get('variant2') }

  ngOnInit(): void {
    this.products = this.productsService.getProducts().pipe(map((response: any) => formatCategoryProduct(response)));

    setTimeout(() => {
      this.showPrimer();
    }, 3000)
  }

  showPrimer(): void {
    this.modal.myStylesPrimer();
  }

  sliceArray(): void {

  }

  selectProduct1(product: CategoryProduct) {
    console.log(product);
    this.variant1?.reset();
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

  selectVariant1(id: string): void {
    this.selectedVariant1 = this.selectedProduct1.variants[this.matchVariantIndex(this.selectedProduct1, id)]
    console.log(this.selectedVariant1);
  }

  selectVariant2(id: string): void {
    this.selectedVariant2 = this.selectedProduct2.variants[this.matchVariantIndex(this.selectedProduct2, id)]
    console.log(this.selectedVariant2);
  }

  matchVariantIndex(product: Product, variant_id: string): number {
    return product.variants.findIndex((variant: Variant) => variant.variant_id == variant_id);
  } 
    
    

  validatePage1(): void {
    if(this.product1Select.valid){
      this.nextPage();
    }
    else {
      this.product1Select.markAllAsTouched();
    }
  }

  validatePage2(): void {
    // if(this.product2Select.valid){
    //   this.nextPage();
    // }
    // else {
    //   this.product2Select.markAllAsTouched();
    // }
    this.nextPage();
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
