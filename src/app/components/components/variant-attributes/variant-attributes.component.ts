import { Component, Input } from '@angular/core';
import { CartItem, Product } from 'src/assets/models/products';

@Component({
  selector: 'app-variant-attributes',
  templateUrl: './variant-attributes.component.html',
  styleUrls: ['./variant-attributes.component.css']
})
export class VariantAttributesComponent {

  @Input() mode: string = 'CartItem';
  @Input() cartItem!: CartItem;
  @Input() productArray!: Product[];
  @Input() productId!: string;

  item!: Product;

  ngOnInit(): void {
    this.initAttributes();
  }

  ngOnChanges(): void {
    this.initAttributes();
  }

  initAttributes(): void {
    if(this.mode == 'Product[]'){
      let result = this.productArray.find(products => products.id === this.productId);
      if(result){
        this.item = result;
      }
    }
    else {
      this.item = this.cartItem.product;
    }

    this.item.product_variants.forEach(variant => {
      
    })
  }


}
