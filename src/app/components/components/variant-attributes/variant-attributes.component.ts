import { Component, ElementRef, EventEmitter, Input, ViewChild, Output } from '@angular/core';
import { CartItem, Product, Variant } from 'src/assets/models/products';
import * as bootstrap from 'bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-variant-attributes',
  templateUrl: './variant-attributes.component.html',
  styleUrls: ['./variant-attributes.component.css']
})
export class VariantAttributesComponent {

  @Input() mode: string = 'CartItem';
  @Input() cartItem!: CartItem;
  @Input() product!: Product;
  @ViewChild('variantAccordion') variantAccordion: ElementRef;

  @Output() addToCart: EventEmitter<{variant: Variant, variant_attributes: Map<string, string>}> = new EventEmitter();
  @Output() orderNow: EventEmitter<{variant: Variant, variant_attributes: Map<string, string>}> = new EventEmitter();

  item!: Product;

  sizes: Map<string, Variant[]> = new Map();
  selectedSize: string;
  selectedSizeVariants: Variant[] = [];
  selectedVariantAttributes: string;
  selectVariantAttrMap: Map<string, string> = new Map();
  selectedVariant: Variant;

  variantForm = new FormGroup({
    variantSize: new FormControl(0, Validators.required),
    variantSelect: new FormControl('', Validators.required),
  });

  get variantSize() { return this.variantForm.get('variantSize') };
  get variantSelect() { return this.variantForm.get('variantSelect') };


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
    this.selectVariantAttrMap.clear();

    variant.attributes.forEach(attr => {
      console.log(attr.attribute_name + ": " + attr.attribute_value)
      this.selectedVariantAttributes += attr.attribute_name + ": " + attr.attribute_value + "\n";
      this.selectVariantAttrMap.set(attr.attribute_name, attr.attribute_value);
      console.log(this.selectVariantAttrMap);
    })
    this.selectedVariant = variant;
  }

  loadVariantAttributes(variant: Variant): Map<string, string> {
    let map = new Map<string, string>();
    variant.attributes.forEach(attr => {
      map.set(attr.attribute_name, attr.attribute_value);
    })
    return map
  }

  toggleAccordion(): void {
    let accordion = new bootstrap.Collapse(this.variantAccordion.nativeElement);
    console.log(accordion);
    accordion.toggle();
  }

  validateForm(): boolean {
    if(this.variantForm.valid){
      return true;
    }
    else {
      console.log("invalid");
      this.variantForm.markAllAsTouched();
      return false;
    }
  }

  addToCartEmit(): void {
    if(this.validateForm()){
      this.addToCart.emit({variant: this.selectedVariant, variant_attributes: this.selectVariantAttrMap});
    }
  }

  orderNowEmit(): void {
    if(this.validateForm()){
      this.orderNow.emit({variant: this.selectedVariant, variant_attributes: this.selectVariantAttrMap});
    }
  }
}
