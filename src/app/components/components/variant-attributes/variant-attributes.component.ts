import { Component, Input } from '@angular/core';
import { CartItem, Product, Variant } from 'src/assets/models/products';

@Component({
  selector: 'app-variant-attributes',
  templateUrl: './variant-attributes.component.html',
  styleUrls: ['./variant-attributes.component.css']
})
export class VariantAttributesComponent {

  @Input() mode: string = 'CartItem';
  @Input() cartItem!: CartItem;
  @Input() product!: Product;

  item!: Product;

  sizes: Map<string, Variant[]> = new Map();
  selectedSize: string;
  selectedSizeVariants: Variant[] = [];
  selectedVariantAttributes: string;

  ngOnInit(): void {
    this.initAttributes();
  }

  ngOnChanges(): void {
    this.initAttributes();
  }

  initAttributes(): void {
    if(this.mode == 'Product'){
      this.item = this.product;
    }
    else {
      this.item = this.cartItem.product;
    }

    //get all available sizes
    this.item.product_variants.forEach(variant => {
      let size = variant.attributes.find(attribute => attribute.attribute_name === "Size");
      if(size){
        let array: Variant[] = [];
        //check if size already exists
        if(this.sizes.has(size.attribute_value)){
          array = this.sizes.get(size.attribute_value)!

          // add item if unique
          if(!array.includes(variant)){
            array.push(variant)
          }
        }
        this.sizes.set(size.attribute_value, array)
      }
    })


    console.log(this.sizes);
  }

  changeSize(size: string){
    this.selectedSize = size;
    this.selectedSizeVariants = this.sizes.get(size)!;
    console.log(this.selectedSizeVariants);
    console.log(this.sizes.get(size));
  }

  changeVariant(variant: Variant){
    console.log(variant);
    this.selectedVariantAttributes = "";

    variant.attributes.forEach(attr => {
      console.log(attr.attribute_name + ": " + attr.attribute_value)
      this.selectedVariantAttributes += attr.attribute_name + ": " + attr.attribute_value + "\n\n";
      console.log(this.selectedVariantAttributes);
    })
  }

  loadVariantAttributes(variant: Variant): Map<string, string> {
    let map = new Map<string, string>();
    variant.attributes.forEach(attr => {
      map.set(attr.attribute_name, attr.attribute_value);
    })
    return map
  }

}
