import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { OutletContext } from '@angular/router';
import { Gallery, GalleryRef } from 'ng-gallery';
import { CartItem } from 'src/assets/models/products';

@Component({
  selector: 'app-edit-cart-item',
  templateUrl: './edit-cart-item.component.html',
  styleUrls: ['./edit-cart-item.component.css']
})
export class EditCartItemComponent {

  constructor(private gallery: Gallery) {}

  @Input() product!:CartItem;
  @Output() dismiss = new EventEmitter();
  galleryRef: GalleryRef = this.gallery.ref('product-images');

  ngOnInit(): void {
    this.product.product.images.forEach((url: string) => {
      console.log(url);
      this.galleryRef.addImage({src: url, thumb: url});
    });
  }
}
