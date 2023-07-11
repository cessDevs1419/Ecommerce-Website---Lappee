import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { Product, ColorVariant } from 'src/assets/models/products';
import { ProductsService } from 'src/app/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { formatProducts, filterProductsById } from 'src/app/utilities/response-utils';
import { GalleryItem, ImageItem, ThumbnailsPosition } from 'ng-gallery';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CartService } from 'src/app/services/cart/cart.service';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { ReviewsService } from 'src/app/services/reviews/reviews.service';
import { Review } from 'src/assets/models/reviews';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  isFaved: boolean = false;
  productId!: string;
  products!: Observable<Product[]>;
  productMatch!: Observable<Product[]>;
  imgArray!: GalleryItem[];
  position!: ThumbnailsPosition;
  currentProduct!: Product;
  reviews!: Observable<Review[]>;
  colorVariants: ColorVariant[] = [];
  selectedPrice!: number;
  hasVariant: boolean = true;
  selectedVariantId: string;

  constructor(private fb: FormBuilder, 
              private productsService: ProductsService, 
              private subcategoriesSerivce: SubcategoriesService,
              private route: ActivatedRoute,
              private bpObserver: BreakpointObserver,
              private cart: CartService,
              public accountService: AccountsService,
              private reviewService: ReviewsService,
              private cdr: ChangeDetectorRef) {}

  colorCurrent = {
    name: '',
    hex: ''
  }

  sizeCurrent = '';

  productToCart: FormGroup = this.fb.group({
    color: ['', Validators.required],
    size: ['', Validators.required]
  });

  postComment: FormGroup = this.fb.group({
    message: ['', Validators.required],
    showUser: ['']
  });

  selectedColorSizes: string[] = [];

  get productColor() { return this.productToCart.get('color') }
  get productSize() { return this.productToCart.get('size') }

  get commentMessage() { return this.postComment.get('message') }
  get commentShowUser() { return this.postComment.get('showUser') }

  ngOnInit() {
    this.productId = String(this.route.snapshot.paramMap.get('productId'));
    this.products = this.productsService.getProducts().pipe(map((response: any) => formatProducts(response)));
    this.productMatch = filterProductsById(this.productId, this.products);
    
    // get local array copy of product observable
    this.productMatch.subscribe((product: Product[]) => {
      if(product.length > 0){
        this.currentProduct = product[0];
        this.selectedPrice = this.currentProduct.price;
        console.log('item found');
        
        this.initVariants();
      }
      else {
        console.log('no items found');
      }

      if(this.currentProduct.product_variants.length > 0){
        this.hasVariant = false
      }
      else {
        this.hasVariant = true;
      }

      this.cdr.detectChanges();
    });

    this.imgArray = [
      new ImageItem({src: 'https://picsum.photos/720/1080', thumb: 'https://picsum.photos/720/1080'}),
      new ImageItem({src: 'https://picsum.photos/720/1080', thumb: 'https://picsum.photos/720/1080'}),
      new ImageItem({src: 'https://picsum.photos/400/500', thumb: 'https://picsum.photos/400/500'}),
      new ImageItem({src: 'https://picsum.photos/400/500', thumb: 'https://picsum.photos/400/500'}),
      new ImageItem({src: 'https://picsum.photos/400/500', thumb: 'https://picsum.photos/400/500'})
    ]

    this.bpObserver.observe(['(min-width: 992px)']).subscribe((res: any) => {
      if(res.matches) {
       this.position = ThumbnailsPosition.Left;
      }

      else {
        this.position = ThumbnailsPosition.Bottom;
      }
    });

    //this.reviews = this.reviewService.getReviews(this.currentProduct[0].id);
  }

  initVariants(): void {
    for(let variantColor of this.currentProduct.product_variants){
      let existingColor = this.colorVariants.find((cv) => cv.color === variantColor.color);
      if(!existingColor){
        let variantSizes: string[] = [];
        for(let variantSize of this.currentProduct.product_variants){
          if(variantSize.color === variantColor.color){
            variantSizes.push(variantSize.size)
          }
        }

        let colVariant: ColorVariant = {
          color: variantColor.color,
          name: variantColor.color_title,
          sizes: variantSizes
        }
        this.colorVariants.push(colVariant)
      }
    }
    console.log(this.colorVariants);
  }

  recheckVariant(): void {
    if(this.currentProduct.product_variants.length > 0){
      this.hasVariant = false
    }
    else {
      this.hasVariant = true;
    }
  }

  fave() {
    this.isFaved = !this.isFaved;
  }

  changeColor(color: string): void {
    this.colorCurrent.name = color;
    this.productColor?.setValue(color);
    this.selectedColorSizes = [];
    let selectedIndex = this.colorVariants.findIndex((cv) => cv.name == this.colorCurrent.name);
    this.selectedColorSizes = this.colorVariants[selectedIndex].sizes;
    console.log(this.productColor?.value);
  }

  changeSize(size: string): void {
    this.sizeCurrent = size;
    let selectedVariant = this.currentProduct.product_variants.find((cv) => cv.color_title === this.colorCurrent.name && cv.size === this.sizeCurrent);
    console.log(selectedVariant ? 'variant found' : 'variant not found');
    this.selectedPrice = Number(selectedVariant?.price);
    this.productSize?.setValue(size);
    this.selectedVariantId = selectedVariant?.variant_id ? selectedVariant.variant_id : "";
    console.log(this.productSize?.value);
  }

  addToCart(): void {
    let variantId = "";
    let details = "";
    if(!this.hasVariant){
      //add to cart with form checks for variant validation
      if(this.productToCart.valid){
        // get variant id of selected color and size
        for(let variant of this.currentProduct.product_variants){
          if(variant.color == this.colorCurrent.hex && variant.size == this.sizeCurrent){
            variantId = variant.variant_id;
          }
        }
        
        details = "Color: " + this.colorCurrent.name + ", Size: " + this.sizeCurrent;
        console.log(this.productToCart.value);
        this.cart.addToCart(this.currentProduct, this.selectedVariantId, details, 1);
        console.warn('added to cart');
      }
  
      else {
        console.log(this.productToCart.value)
        console.log("invalid order");
        this.productToCart.markAllAsTouched();
      }
    }

    // add to cart without variant
    else {
        console.log(this.productToCart.value);
        this.cart.addToCart(this.currentProduct, "", "", 1);
        console.warn('added to cart');
    }
  }

  onSubmit(): void {
    if(this.productToCart.valid){
      console.log(this.productToCart.value);
      console.warn('order submitted');
    }

    else if(this.productToCart.invalid){
      console.log(this.productToCart.value);
      this.productToCart.markAllAsTouched();
    }

    console.log(this.productToCart.value);
  }

  submitComment(): void {
    if(this.postComment.valid){
      console.log(this.postComment.value);
      console.warn('comment submitted');
    }

    else if(this.postComment.invalid){
      this.postComment.markAllAsTouched();
    }
  }
}
