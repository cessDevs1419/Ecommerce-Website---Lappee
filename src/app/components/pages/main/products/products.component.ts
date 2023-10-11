import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, OnChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { Product, ColorVariant, Variant } from 'src/assets/models/products';
import { ProductsService } from 'src/app/services/products/products.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { formatProducts, filterProductsById, formatReviews, formatReviewsDetails } from 'src/app/utilities/response-utils';
import { Gallery, GalleryItem, GalleryRef, ImageItem, ThumbnailsPosition } from 'ng-gallery';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CartService } from 'src/app/services/cart/cart.service';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { ReviewsService } from 'src/app/services/reviews/reviews.service';
import { Review, ReviewItem } from 'src/assets/models/reviews';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/assets/models/user';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  Number = Number;
  isFaved: boolean = false;
  productId!: string;
  product!: Observable<Product[]>;
  imgArray: GalleryItem[] = [];
  position!: ThumbnailsPosition;
  currentProduct!: Product;
  colorVariants: ColorVariant[] = [];
  selectedPrice!: number;
  hasVariant: boolean = true;
  selectedVariantId: string;
  
  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default"; 
  
  reviews!: Observable<ReviewItem>;
  reviewsList!: Observable<Review[]>;
  reviewListArray: Review[] = [];
  reviewMatch: Review;
  reviewListMatched: Review[] = [];

  userId: string;

  navsubscription: any;

  galleryRef: GalleryRef = this.gallery.ref('product-images');

  @ViewChild(ToastComponent) toast: ToastComponent;
  @ViewChild("itemTemplate", {static: true}) itemTemplate: TemplateRef<any>;

  //pagination
  currentPage: number = 1;
  itemsPerPage: number = 3;


  constructor(private fb: FormBuilder, 
              private productsService: ProductsService, 
              private subcategoriesSerivce: SubcategoriesService,
              private route: ActivatedRoute,
              private bpObserver: BreakpointObserver,
              private cart: CartService,
              public accountService: AccountsService,
              private reviewService: ReviewsService,
              private cdr: ChangeDetectorRef,
              private gallery: Gallery,
              private router: Router,
              private activatedRoute: ActivatedRoute) {}

  colorCurrent = {
    name: '',
    hex: ''
  }

  sizeCurrent = '';

  productToCart: FormGroup = this.fb.group({
    color: ['', Validators.required],
    size: ['', Validators.required],
    quantity: [1, Validators.required]
  });

  postComment: FormGroup = this.fb.group({
    message: ['', Validators.required]
  });

  selectedColorSizes: string[] = [];
  maxStock: number = 0;

  get productColor() { return this.productToCart.get('color') }
  get productSize() { return this.productToCart.get('size') }
  get productQuantity() { return this.productToCart.get('quantity') }

  get commentMessage() { return this.postComment.get('message') }
  //get commentShowUser() { return this.postComment.get('showUser') }

  ngOnInit() {
    
    // initialize product

    this.navsubscription = this.activatedRoute.params.subscribe(params => {
      this.colorVariants = [];
      this.initProducts();
    })

    // initialize gallery
    this.bpObserver.observe(['(min-width: 992px)']).subscribe((res: any) => {
      if(res.matches) {
       this.position = ThumbnailsPosition.Left;
      }

      else {
        this.position = ThumbnailsPosition.Bottom;
      }
    });
    
  }

  ngOnChanges(): void {
    this.initProducts();
  }

  initProducts(): void {

    this.accountService.checkLoggedIn().subscribe({
      next: (state: boolean) => {
        if(state){
          this.accountService.getLoggedUser().subscribe({
            next: (user: User) => {
              this.userId = user.user_id;
            }
          })
        }
      }
    })
    
    this.productId = String(this.route.snapshot.paramMap.get('productId'));
    this.product = this.productsService.getProductDetails(this.productId).pipe(map((response: any) => formatProducts(response)));

    // get local array copy of product observable
    this.product.subscribe((product: Product[]) => {
      if(product.length > 0){
        this.currentProduct = product[0];
        this.selectedPrice = Number(this.currentProduct.variants[0].price);
        
        // initialize gallerize
        this.galleryRef.reset();
        product[0].variants.forEach((variant: Variant) => {
          let url = variant.images[0];
          this.galleryRef.addImage({src: url, thumb: url});
        });

        console.log(this.imgArray);

        // get reviews
        let reviewData = this.reviewService.getReviews(this.currentProduct.id);
        reviewData.subscribe((response: any) => this.reviews = formatReviews(response));

        this.reviewsList = this.reviewService.getReviews(this.currentProduct.id).pipe(map((response: any) => formatReviewsDetails(response)))
        this.reviewsList.subscribe({
          next: (reviews: Review[]) => {
            this.reviewListArray = reviews;
            let matchIndex = -1;
            if(this.userId){
              console.log("user id found")
              matchIndex = this.matchReviewFromUser(this.reviewListArray);
            }
            if(matchIndex > -1) {
              this.reviewMatch = this.reviewListArray[matchIndex];
              this.reviewListArray.splice(matchIndex, 1);
              this.reviewListArray.unshift(this.reviewMatch);
              this.reviewListMatched = this.reviewListArray;
            }
            else {
              this.reviewListMatched = this.reviewListArray;
            }
            console.log(matchIndex);
            console.log(this.reviewListArray);
            console.log(this.reviewListMatched);

          }
        });

        console.log('item found');
        
        //this.initVariants();
      }
      else {
        console.log('no items found');
      }

      if(this.currentProduct.variants.length > 0){
        this.hasVariant = false
      }
      else {
        this.hasVariant = true;
      }

      this.cdr.detectChanges();
    });
  }
  
/*
  initVariants(): void {
    for(let variantColor of this.currentProduct.variants){
      let existingColor = this.colorVariants.find((cv) => cv.color === variantColor.color);
      if(!existingColor){
        let variantSizes: string[] = [];
        for(let variantSize of this.currentProduct.variants){
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
*/

  recheckVariant(): void {
    if(this.currentProduct.variants.length > 0){
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

  /*
  changeSize(size: string): void {
    this.sizeCurrent = size;
    let selectedVariant = this.currentProduct.variants.find((cv) => cv.color_title === this.colorCurrent.name && cv.size === this.sizeCurrent);
    console.log(selectedVariant ? 'variant found' : 'variant not found');
    this.selectedPrice = Number(selectedVariant?.price);
    this.productSize?.setValue(size);
    this.selectedVariantId = selectedVariant?.variant_id ? selectedVariant.variant_id : "";
    this.maxStock = selectedVariant?.stock ? selectedVariant.stock : 0;
    console.log(this.productSize?.value);
  }
  */

  addToCartAttr(params: {variant: Variant, variant_attributes: Map<string, string>}) {
    let details: string[] = [];
    console.log(params.variant_attributes);
    params.variant_attributes.forEach((key, value) => {
      details.push(value + ": " + key);
    })
    this.cart.addToCart(this.currentProduct, params.variant.variant_id, params.variant_attributes, 1, params.variant.price, params.variant.images)

    console.warn('added to cart');
    console.log(this.cart.items);

    this.toastHeader = "Successful!";
    this.toastContent = "The item has been added to your cart.";
    this.toast.switchTheme('default');
    this.toast.show();
  }

  orderNowAttr(params: {variant: Variant, variant_attributes: Map<string, string>}): void {
    this.addToCartAttr(params);
    this.router.navigate(['/cart']);
  }

  /*
  addToCart(): boolean {
    let variantId = "";
    let details = [];
    if(!this.hasVariant){
      //add to cart with form checks for variant validation
      if(this.productToCart.valid){
        // get variant id of selected color and size
        for(let variant of this.currentProduct.variants){
          if(variant.color == this.colorCurrent.hex && variant.size == this.sizeCurrent){
            variantId = variant.variant_id;
          }
        }
        
        details = [this.colorCurrent.name, this.sizeCurrent]
        console.log(this.productToCart.value);
        //this.cart.addToCart(this.currentProduct, this.selectedVariantId, details, this.productToCart.get('quantity')?.value, this.selectedPrice.toString(), this.currentProduct.images);
        console.warn('added to cart');

        this.toastHeader = "Successful!";
        this.toastContent = "The item has been added to your cart.";
        this.toast.switchTheme('default');
        this.toast.show();

        return true;
      }
  
      else {
        console.log(this.productToCart.value)
        console.log("invalid order");
        this.productToCart.markAllAsTouched();
        return false;
      }
    }
    return false;

    // add to cart without variant
    /* else {
        console.log(this.productToCart.value);
        this.cart.addToCart(this.currentProduct, "", "", 1, this.currentProduct.price.toString());
        console.warn('added to cart');
    }
  }
  

  orderNow(): void {
    if(this.productToCart.valid){
      console.log(this.productToCart.value);
      console.warn('order submitted');
      if(this.addToCart()){
        this.router.navigate(['/cart']);
      };
      
    }

    else if(this.productToCart.invalid){
      console.log(this.productToCart.value);
      this.productToCart.markAllAsTouched();
    }

    console.log(this.productToCart.value);
  }
  */

  matchReviewFromUser(arr: Review[]): number {
    let matchIndex = -1;

    arr.forEach((value, index) => {
      if(value.user_id == this.userId){
        matchIndex = index;
      }
    })

    return matchIndex;
  }
  
  
  paginateReview(): Review[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.reviewListMatched.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  submitComment(): void {
    let formData: any = new FormData();
    formData.append('product_id', this.currentProduct.id);
    formData.append('rating', 4);
    formData.append('content', this.commentMessage?.value);


    if(this.postComment.valid){
      console.log(this.postComment.value);
      this.reviewService.postReview(formData).subscribe({
        next: (response: any) => {
          this.toastHeader = "Successful!";
          this.toastContent = "Your review has been added.";
          this.toast.switchTheme('default');
          this.toast.show();

          let reviewData = this.reviewService.getReviews(this.currentProduct.id);
          reviewData.subscribe((response: any) => this.reviews = formatReviews(response))
          this.reviewsList = this.reviewService.getReviews(this.currentProduct.id).pipe(map((response: any) => formatReviewsDetails(response)));
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      })
      console.warn('comment submitted');
    }

    else if(this.postComment.invalid){
      this.postComment.markAllAsTouched();
    }
  }

  deleteReview(id: string){
    console.log(id);
    let formData = new FormData;
    formData.append('product_id', this.currentProduct.id);
    formData.append('review_id', id)

    console.log(formData);

    this.reviewService.deleteReview(formData).subscribe({
      next: (response: any) => {
        this.toastHeader = "Successful!";
        this.toastContent = "Your review has been deleted.";
        this.toast.switchTheme('default');
        this.toast.show();

        let reviewData = this.reviewService.getReviews(this.currentProduct.id);
        reviewData.subscribe((response: any) => this.reviews = formatReviews(response))
        this.reviewsList = this.reviewService.getReviews(this.currentProduct.id).pipe(map((response: any) => formatReviewsDetails(response)));
      },
      error: (err: HttpErrorResponse) => {
        this.toastHeader = "Error!";
        this.toastContent = "Please try again in a few moments.";
        this.toast.switchTheme('negative');
        this.toast.show();
      }
    })
  }
}
