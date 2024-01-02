import { Component, ElementRef, EventEmitter, Input, ViewChild, Output } from '@angular/core';
import { CartItem, Product, Variant } from 'src/assets/models/products';
import * as bootstrap from 'bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Size } from 'src/assets/models/size-chart';

@Component({
  selector: 'app-variant-attributes',
  templateUrl: './variant-attributes.component.html',
  styleUrls: ['./variant-attributes.component.css']
})
export class VariantAttributesComponent {

  @Input() mode: string = 'CartItem';
  @Input() cartItem!: CartItem;
  @Input() product!: Product;
  @Input() size: Size[];
  @ViewChild('variantAccordion') variantAccordion: ElementRef;
  @ViewChild('sizeAccordion') sizeAccordion: ElementRef;

  @Output() addToCart: EventEmitter<{variant: Variant, variant_attributes: Map<string, string>}> = new EventEmitter();
  @Output() orderNow: EventEmitter<{variant: Variant, variant_attributes: Map<string, string>}> = new EventEmitter();
  @Output() dismiss: EventEmitter<any> = new EventEmitter<any>();
  @Output() editCartItem: EventEmitter<{variant: Variant, variant_attributes: Map<string, string>}> = new EventEmitter();

  item!: Product;

  sizes: Map<string, Variant[]> = new Map();
  selectedSize: string;
  selectedSizeVariants: Variant[] = [];
  selectedVariantAttributes: string;
  selectVariantAttrMap: Map<string, string> = new Map();
  selectedVariant: Variant;
  preselectedVariant: string;

  variantForm = new FormGroup({
    variantSize: new FormControl('', Validators.required),
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
    this.item.variants.forEach(variant => {
      let size = variant.attributes.find(attribute => attribute.attribute_name === "Size");
      if(size){
        let array: Variant[] = [];
        //check if size already exists
        if(this.sizes.has(size.value)){
          array = this.sizes.get(size.value)!

          // add item if unique
          if(!array.includes(variant)){
            array.push(variant)
          }
        }
        this.sizes.set(size.value, array)
      }
    })

    if(this.mode == "CartItem"){
      let itemSize = this.cartItem.variant_details.get('Size')!;
      this.variantForm.setValue({
        variantSize: itemSize,
        variantSelect: this.cartItem.variant
      })
      this.preselectedVariant = this.cartItem.variant;
      this.selectedSize = itemSize;
      this.selectedSizeVariants = this.sizes.get(itemSize)!;
    }

    //console.log(this.sizes);
  }

  changeSize(size: string){
    this.selectedSize = size;
    this.selectedSizeVariants = this.sizes.get(size)!;
    if(this.selectedSizeVariants.length == 1) {
      this.changeVariant(this.selectedSizeVariants[0]);
      this.variantSelect?.setValue(this.selectedSizeVariants[0].variant_id);
      this.selectedVariant = this.selectedSizeVariants[0];
    }
   // console.log(this.selectedSizeVariants);
    //console.log(this.sizes.get(size));

   // console.log(this.cartItem.variant_details.get('Size'));
  }

  changeVariant(variant: Variant){
    //console.log(variant);
    this.selectedVariantAttributes = "";
    this.selectVariantAttrMap.clear();

    variant.attributes.forEach(attr => {
     // console.log(attr.attribute_name + ": " + attr.value)
      this.selectedVariantAttributes += attr.attribute_name + ": " + attr.value + "\n";
      this.selectVariantAttrMap.set(attr.attribute_name, attr.value);
      //console.log(this.selectVariantAttrMap);
      //console.log(this.selectedVariantAttributes);
    })
    this.selectedVariant = variant;
  }

  loadVariantAttributes(variant: Variant): Map<string, string> {
    let map = new Map<string, string>();
    variant.attributes.forEach(attr => {
      map.set(attr.attribute_name, attr.value);
    })
    return map
  }

  toggleAccordion(): void {
    let accordion = new bootstrap.Collapse(this.variantAccordion.nativeElement);
    //console.log(accordion);
    accordion.toggle();
  }

  toggleSizeAccordion(): void {
    let accordion = new bootstrap.Collapse(this.sizeAccordion.nativeElement);
    accordion.toggle();
  }

  validateForm(): boolean {
    if(this.variantForm.valid){
      return true;
    }
    else {
      //console.log("invalid");
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

  editCartItemEmit(): void {
    if(this.preselectedVariant != this.variantSelect?.value){

      this.editCartItem.emit({variant: this.selectedVariant, variant_attributes: this.selectVariantAttrMap})
    }
    else {
      this.emitDismiss()
    }
  }

  compare(one: string, two: string){
    //console.log()
  }

  emitDismiss(): void {
    //console.log("emitDismiss");
    this.dismiss.emit();
  }
}
