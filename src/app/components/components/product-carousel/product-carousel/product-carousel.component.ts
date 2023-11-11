import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CategoryProduct, Product } from 'src/assets/models/products';
import * as bootstrap from 'bootstrap';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.css']
})
export class ProductCarouselComponent {

  constructor(private bpo: BreakpointObserver) {}

  @Input() products: CategoryProduct[] = [];
  @Input() itemsPerPage: number;
  @Input() id: string = 'prod-carousel'
  totalItems: number;
  itemGroups: CategoryProduct[][] = [];
  @ViewChild('carousel') carousel: ElementRef;

  filler: CategoryProduct = {
    product_id: '',
    name: '',
    price: 0,
    preview_image: ''
  }

  ngOnInit(): void {
    // this.bpo.observe(['(max-width: 576px)']).subscribe((res: any) => {
    //   if(res.matches) {
    //    this.itemsPerPage = 3      
    //   }
    // });
    this.sliceArray();
  }

  ngOnChanges(): void {
    this.sliceArray();
  }

  sliceArray(): void {
    let currentIndex = 0;
    this.totalItems = this.products.length;
    console.log(this.totalItems);

    while (currentIndex < this.products.length) {
      let slice = this.products.slice(currentIndex, currentIndex + this.itemsPerPage);
      if(slice.length < this.itemsPerPage){
        while(slice.length < this.itemsPerPage){
          slice.push(this.filler);
        }
      }
      this.itemGroups.push(slice);
      currentIndex += this.itemsPerPage;
    }

    console.log(this.itemGroups);
  }

  prev(): void {
    const instance = new bootstrap.Carousel(this.carousel.nativeElement);
    instance.prev()
  }

  next(): void {
    const instance = new bootstrap.Carousel(this.carousel.nativeElement);
    instance.next()
  }
}
