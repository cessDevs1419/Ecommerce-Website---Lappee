import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { OutletContext } from '@angular/router';
import { Gallery, GalleryRef } from 'ng-gallery';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem, Variant } from 'src/assets/models/products';

@Component({
  selector: 'app-edit-cart-item',
  templateUrl: './edit-cart-item.component.html',
  styleUrls: ['./edit-cart-item.component.css']
})
export class EditCartItemComponent {

  constructor(private gallery: Gallery, private cart: CartService) {}

  @Input() product!: CartItem;
  @Output() dismiss = new EventEmitter();
  @Output() editCartItem: EventEmitter<{newCartItem: CartItem, cartIndex: number}> = new EventEmitter();
  galleryRef: GalleryRef = this.gallery.ref('product-images');

  ngOnInit(): void {
    this.product.image_url.forEach((url: string) => {
      console.log(url);
      this.galleryRef.addImage({src: url, thumb: url});
    });

    console.log(this.product.variant_details)
  }

  emitDismiss(): void {
    this.dismiss.emit();
  }

  editItem(event: {variant: Variant, variant_attributes: Map<string, string>}): void {
    let itemIndex = this.cart.getItems().findIndex((item: CartItem) => item.variant === this.product.variant);
    
    if(itemIndex > -1){
      let newItem: CartItem = {
        product: this.product.product,
        variant: event.variant.variant_id,
        variant_details: event.variant_attributes,
        quantity: 1,
        price: event.variant.price,
        image_url: event.variant.images
      }
      this.editCartItem.emit({newCartItem: newItem, cartIndex: itemIndex})
    }
    else {
      this.emitDismiss();
    }
  }
}
