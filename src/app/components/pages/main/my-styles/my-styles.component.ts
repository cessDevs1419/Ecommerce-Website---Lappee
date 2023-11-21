import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as bootstrap from 'bootstrap';
import { Observable, map } from 'rxjs';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';
import { ProductsService } from 'src/app/services/products/products.service';
import { formatCategoryProduct, formatProductAll, formatProductObj, formatProducts } from 'src/app/utilities/response-utils';
import { CategoryProduct, Product, Variant } from 'src/assets/models/products';
import { CdkDrag } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-my-styles',
  templateUrl: './my-styles.component.html',
  styleUrls: ['./my-styles.component.css']
})
export class MyStylesComponent {

  constructor(private productsService: ProductsService, public domSanitizer: DomSanitizer) {}
  
  products: Observable<Product[]>;
  productsCache: Product[];
  variantsTop: Variant[] = [];
  variantsBot: Variant[] = [];
  selectedVariants: Variant[] = [];
  //selectedProduct: Product;
  selectedProduct1: Product;
  selectedProduct2: Product;
  selectedVariant1: Variant;
  selectedVariant2: Variant;
  @ViewChild('carousel') carousel: ElementRef;
  @ViewChild(ModalClientComponent) modal: ModalClientComponent;

  mode: string = "";

  isLoading: boolean = true;


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
    this.products = this.productsService.getProductsAll().pipe(map((response: any) => formatProductAll(response)));
    this.products.subscribe({
      next: (response: Product[]) => {
        this.productsCache = response;
        console.log(this.productsCache)
        this.setupVariants();
      }
    })
    setTimeout(() => {
      this.showPrimer();
    }, 3000)
  }

  setupVariants(): void {
    this.productsCache.forEach((product: Product) => {
      product.variants.forEach((variant: Variant) => {
        this.variantsTop.push(variant);
      })
      product.variants.forEach((variant: Variant) => {
        this.variantsBot.push(variant);
      })
    })
    this.isLoading = false;
  }

  showPrimer(): void {
    this.modal.myStylesPrimer();
  }

  sliceArray(): void {

  }

  selectProduct1(product: Product) {
    console.log(product);
    this.variant1?.reset();
    this.selectedProduct1 = product;
  }

  selectProduct2(product: Product) {
    this.variant2?.reset();
    this.selectedProduct2 = product;
  }

  selectVariant1(variant: Variant): void {
    this.selectedVariant1 = variant
    console.log(this.selectedVariant1);
  }

  selectVariant2(variant: Variant): void {
    this.selectedVariant2 = variant
    console.log(this.selectedVariant1);
  }

  matchVariantIndex(product: Product, variant_id: string): number {
    return product.variants.findIndex((variant: Variant) => variant.variant_id == variant_id);
  } 

  matchVariantProductName(variant: Variant): string {
    let result = this.productsCache.find((product: Product) => product.id === variant.product_id);
    return result?.name!;
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
