import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as bootstrap from 'bootstrap';
import { Observable, filter, map } from 'rxjs';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';
import { ProductsService } from 'src/app/services/products/products.service';
import { formatCategoryProduct, formatProductAll, formatProductObj, formatProducts } from 'src/app/utilities/response-utils';
import { Attribute, CategoryProduct, Product, Variant } from 'src/assets/models/products';
import { CdkDrag } from '@angular/cdk/drag-drop'
import { CartService } from 'src/app/services/cart/cart.service';
import { Router } from '@angular/router';

class VariantClass  {
  variant_id: string;
  variant_name: string;
  attributes: Attribute[];
  stock: number;
  price: string;
  images: string[];
  product_id: string;
}

@Component({
  selector: 'app-my-styles',
  templateUrl: './my-styles.component.html',
  styleUrls: ['./my-styles.component.css']
})


export class MyStylesComponent {

  constructor(private productsService: ProductsService, public domSanitizer: DomSanitizer, private cart: CartService, private router: Router) {}
  
  products: Observable<Product[]>;
  productsCache: Product[];

  // items in catalogs
  variantsTop: Variant[] = [];
  variantsBot: Variant[] = [];

  // variants the user selects
  selectedVariant1: Variant;
  selectedVariant2: Variant;

  // variants that are selected on summary section
  checkoutVariant1: Variant;
  checkoutVariant2: Variant;

  // models for checkoutVariant
  modelCV1: Variant;
  modelCV2: Variant;

  selectedVariants: Variant[] = [];
  //selectedProduct: Product;
  selectedProduct1: Product;
  selectedProduct2: Product;
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

  dummyVariant: Variant = {
    variant_id: '',
    variant_name: '',
    attributes: [],
    stock: 0,
    price: '',
    images: [],
    product_id: ''
  }

  ngOnInit(): void {
    this.products = this.productsService.getProductsAll().pipe(map((response: any) => formatProductAll(response)));
    this.products.subscribe({
      next: (response: Product[]) => {
        this.productsCache = response;
        console.log(this.productsCache)
        this.setupVariants();
      }
    })
    this.showPrimer();
  }

  setupVariants(): void {
    let allVariants: Variant[] = [];
    this.productsCache.forEach((product: Product) => {
      product.variants.forEach((variant: Variant) => {
        allVariants.push(variant);
      })
      console.log(allVariants);

      // product.variants.forEach((variant: Variant) => {
        //   this.variantsBot.push(variant);
        // })
    })
    this.variantsTop = this.filterUniqueProductVariants(allVariants)    

    console.log(this.variantsTop)
    for(let i = 0; i < 1; i++){
      this.variantsBot.push(this.variantsTop[i]);
      this.variantsTop.shift();
    }
    this.isLoading = false;
  }

  benchmark(func: Function, n: number): number[]{
    let t0,t1;
    t0 = performance.now();
    //console.log(t0)
    for(let i = 0; i < n; i++){
      func(this.variantsTop)
    }
    t1 = performance.now();
    //console.log(t1)

    return [t1 - t0, n * 1000 / (t1 - t0)]
  }

  // filterUniqueVariants(array: Variant[]): Variant[] {
  //   const uniqueVariants = [];
  //   const seenVariantIds = new Set();
  //   for (const variant of array) {
  //     if (!seenVariantIds.has(variant.variant_id)) {
  //       uniqueVariants.push(variant);
  //       seenVariantIds.add(variant.variant_id);
  //     }
  //   }
  //   return uniqueVariants;
  // }

  filterUniqueProductVariants(variants: Variant[]): Variant[] {
    const uniqueColorsMap = new Map<string, Variant>();
    variants.forEach((variant) => {
      const { product_id, attributes } = variant;
      const colorAttribute = attributes.find(attr => attr.attribute_name === 'Color');
  
      if (colorAttribute) {
        const key = `${product_id}-${colorAttribute.value}`;
        if (!uniqueColorsMap.has(key)) {
          uniqueColorsMap.set(key, variant);
        }
      }
    });
    const uniqueColors = Array.from(uniqueColorsMap.values());
    return uniqueColors;
  }

  showPrimer(): void {
    this.modal.myStylesPrimer();
  }


  // selectProduct1(product: Product) {
  //   console.log(product);
  //   this.variant1?.reset();
  //   this.selectedProduct1 = product;
  // }

  // selectProduct2(product: Product) {
  //   this.variant2?.reset();
  //   this.selectedProduct2 = product;
  // }

  selectVariant1(variant: Variant): void {
    this.selectedVariant1 = variant;
    this.checkoutVariant1 = variant;
    this.modelCV1 = variant;
    console.log(this.selectedVariant1);
  }

  selectVariant2(variant: Variant): void {
    this.selectedVariant2 = variant;
    this.checkoutVariant2 = variant;
    this.modelCV2 = variant;
    console.log(this.selectedVariant1);
  }

  modelCV1Change(event: Variant) {
    this.modelCV1 = event;
    this.checkoutVariant1 = event;
    console.log(event);
    console.log(this.modelCV1)
  }

  modelCV2Change(event: Variant) {
    this.modelCV2 = event;
    this.checkoutVariant2 = event;
    console.log(event);
    console.log(this.modelCV2)
  }

  checkoutVariant2Change(variant: Event){
    
  }

  matchVariantIndex(product: Product, variant_id: string): number {
    return product.variants.findIndex((variant: Variant) => variant.variant_id == variant_id);
  } 

  matchVariantProduct(variant: Variant): Product {
    let result = this.productsCache.find((product: Product) => product.id === variant.product_id);
    return result!;
  }

  matchVariantSameColor(variant: Variant): Variant[] {
    let color = variant.attributes.find((attribute: Attribute) => attribute.attribute_name === "color" || attribute.attribute_name === "Color")?.value;
    let product = this.matchVariantProduct(variant);
    let resultArray = product.variants.filter((variant: Variant) => (variant.attributes.find((attr: Attribute) => attr.attribute_name === "color" || attr.attribute_name === "Color")?.value) === color )

    return resultArray
  }

  getSizeAttribute(variant: Variant): string {
    return variant.attributes.find((attr: Attribute) => attr.attribute_name === 'size' || attr.attribute_name === 'Size')?.value!
  }

  compareSize(variant1: Variant, variant2: Variant): boolean{
    let var1Size = variant1.attributes.find((attr: Attribute) => attr.attribute_name === 'size' || attr.attribute_name === 'Size')?.value!;
    let var2Size = variant2.attributes.find((attr: Attribute) => attr.attribute_name === 'size' || attr.attribute_name === 'Size')?.value!;

    return var1Size === var2Size;
  }

  calcTotal(): string {
    let variant1Price = this.checkoutVariant1 ? Number(this.checkoutVariant1.price) : 0;
    let variant2Price = this.checkoutVariant2 ? Number(this.checkoutVariant2.price) : 0;
    return String(variant1Price + variant2Price);
  }

  resetSelection(): void {
    this.checkoutVariant1 = new VariantClass();
    this.checkoutVariant2 = new VariantClass();
    this.modelCV1 = this.dummyVariant;
    this.modelCV2 = this.dummyVariant;
    this.selectedVariant1 = this.dummyVariant;
    this.selectedVariant2 = this.dummyVariant;  
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

  addToCart(): void {
    let product1 = this.matchVariantProduct(this.checkoutVariant1);
    let product2 = this.matchVariantProduct(this.checkoutVariant2);

    let var1attr: Map<string, string> = new Map<string, string>();
    this.checkoutVariant1.attributes.forEach((attr: Attribute) => {
      var1attr.set(attr.attribute_name, attr.value);
    })
    let var2attr: Map<string, string> = new Map<string, string>();
    this.checkoutVariant2.attributes.forEach((attr: Attribute) => {
      var2attr.set(attr.attribute_name, attr.value);
    })

    this.cart.addToCart(product1, this.checkoutVariant1.variant_id, var1attr, 1, this.checkoutVariant1.price, this.checkoutVariant1.images)
    this.cart.addToCart(product2, this.checkoutVariant2.variant_id, var2attr, 1, this.checkoutVariant2.price, this.checkoutVariant2.images)

    this.router.navigate(['/cart']);
  }
}
