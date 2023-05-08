import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { Product } from 'src/assets/models/products';
import { ProductsService } from 'src/app/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { formatProducts, filterProductsById } from 'src/app/utilities/response-utils';
import { GalleryItem, ImageItem, ThumbnailsPosition } from 'ng-gallery';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CartService } from 'src/app/services/cart/cart.service';

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
  currentProduct!: Product[];

  constructor(private fb: FormBuilder, 
              private productsService: ProductsService, 
              private subcategoriesSerivce: SubcategoriesService,
              private route: ActivatedRoute,
              private bpObserver: BreakpointObserver,
              private cart: CartService) {}

  // color sample object
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

  colors = [
    { name: 'black', hex: '#000000'},
    { name: 'primary', hex:'#1C92FF'},
    { name: 'gray', hex: '#3C3C3C'}
  ];

  sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

  get productColor() { return this.productToCart.get('color') }
  get productSize() { return this.productToCart.get('size') }

  get commentMessage() { return this.postComment.get('message') }
  get commentShowUser() { return this.postComment.get('showUser') }

  ngOnInit() {
    this.productId = String(this.route.snapshot.paramMap.get('productId'));
    this.products = this.productsService.getProducts().pipe(map((response: any) => formatProducts(response)));
    this.productMatch = filterProductsById(this.productId, this.products);

    this.productMatch.subscribe(product => {
      this.currentProduct = product;
    })
    console.log(this.productId);

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
  }

  fave() {
    this.isFaved = !this.isFaved;
  }

  changeColor(color: string): void {
    this.colorCurrent.name = color;
    this.productColor?.setValue(color);
    console.log(this.productColor?.value);
  }

  changeSize(size: string): void {
    this.sizeCurrent = size;
    this.productSize?.setValue(size);
    console.log(this.productSize?.value);
  }

  addToCart(): void {
    if(this.productToCart.valid){
      console.log(this.productToCart.value);
      this.cart.addToCart(this.currentProduct[0], "s", 1);
      console.warn('added to cart');
    }

    else if(this.productToCart.invalid){
      console.log(this.productToCart.value);
      this.productToCart.markAllAsTouched();
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
