import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { VariantsService } from 'src/app/services/variants/variants.service';
import { formatAdminCategories, formatAdminCategoriesAttribute, formatProductObj, formatProducts } from 'src/app/utilities/response-utils';
import { AdminCategory, NewAdminCategory } from 'src/assets/models/categories';
import { Product } from 'src/assets/models/products';
import { RichTextEditorComponent } from '../../rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-variants-form',
  templateUrl: './variants-form.component.html',
  styleUrls: ['./variants-form.component.css']
})
export class VariantsFormComponent {

  @Input() formAddVariant!: boolean;
  @Input() selectedRowData: any;
  @Output() cancelVariant: EventEmitter<void> = new EventEmitter();
  @ViewChild(RichTextEditorComponent) editor: RichTextEditorComponent;
    
  variantForm: FormGroup;
  attributeForm: FormGroup;
  productForm: FormGroup;
  
  formColor: string = "dark-form-bg"
  formTextColor: string = "dark-theme-text-color"
  formInputColor: string = "text-white"
  formBorderColor: string = "border-grey"
  pagebordercolor: string = 'linear-gradient-border'
  
  products!: Observable<Product[]>;
  productDetails!: Observable<Product>;
  categories!: Observable<AdminCategory[]>;
  attributes!: Observable<NewAdminCategory[]>;
	categoryAttributes!: Observable<NewAdminCategory>;
  attributeFormsArray: any[] = [];
  stockBorder: boolean = false;
  priceBorder: boolean = false;
  validationStatus: { [key: string]: boolean } = {};
  name: boolean = false;

  constructor(
    private http: HttpClient,
    private product_service: ProductsService,
    private variantService: VariantsService,
    private errorMessages: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private category_service: CategoriesService
  ) 
  {
      
      this.productForm = this.formBuilder.group({
        name: ['', Validators.required],
        category: ['', Validators.required],
        description: [''],
        include: [0],
        variants: this.formBuilder.array([]), 
      });  

      this.variantForm = this.formBuilder.group({
          name: ['', Validators.required],
          stock: [1 , [Validators.required]],
          price: [1 , [Validators.required]],
          images: this.formBuilder.array([]),
          mystyle: this.formBuilder.array([]),
          attributes: this.formBuilder.array([])
      });


  }
  ngOnInit(): void{
    this.productDetails = this.product_service.getProductDetails(this.selectedRowData).pipe(map((Response: any) => formatProductObj(Response)));
		this.categories = this.category_service.getAdminCategories().pipe(map((Response: any) => formatAdminCategories(Response)));
    this.products = this.product_service.getAdminProducts().pipe(map((Response: any) => formatProducts(Response)));

        // if (this.selectedRowData) {
        //     this.productDetails = this.product_service.getProductDetails(this.selectedRowData).pipe(map((Response: any) => formatProductObj(Response)));
        //     this.product_service.getProductDetails(this.selectedRowData).subscribe((response: any) => {
        //         const formattedProduct = formatProductObj(response);
        //         const variants = formattedProduct.variants
                
        //         this.productForm.get('name')?.setValue(formattedProduct.name);
        //         this.productForm.get('category')?.setValue(formattedProduct.category);

        //         setTimeout(() => {
        //             this.productForm.get('description')?.setValue(formattedProduct.description);
        //             this.editor.editorSetValue(formattedProduct.description);
        //           }, 1500);

                 
                
        //         // for (const variant of variants) {
        //         //     const newVariantGroup = this.formBuilder.group({
        //         //         variant_id: [variant.variant_id],
        //         //         product_id: [variant.product_id],
        //         //         name: [variant.variant_name],
        //         //         price: [variant.price],
        //         //         stock: [variant.stock],
        //         //         attributes: this.formBuilder.array(variant.attributes),
        //         //         images: this.formBuilder.array(variant.images),
        //         //         // mystyle: this.formBuilder.array(variant.mystyle)
        //         //     });
        //         //     this.variantsListsData.push(newVariantGroup);
                    
        //         // }
                
        //         // for (let i = 0; i < variants.length; i++) {
        //         //     if (this.editvariantForms.length <= i) {
        //         //         const newIndex = this.editvariantForms.length; 
        //         //         this.editvariantForms.push({ index: newIndex, isVisible: false }); 
        //         //     }
        //         // }
                
        //         // this.editAttributes = false
        //         // this.addAttributeForm.reset()
        //         // this.attributeFormsArray.splice(0)
        //         // const formGroup = this.addAttributeForm; 
        //         // const controlNames = Object.keys(formGroup.controls);
        //         // controlNames.forEach((controlName) => {
        //         //     formGroup.removeControl(controlName);
        //         // });

        //         this.categoryAttributes = this.category_service.getCategoryAttribute(formattedProduct.category).pipe(map((Response: any) => formatAdminCategoriesAttribute(Response)));
        //         this.categoryAttributes.subscribe((data: NewAdminCategory) => {
        //             if (data && data.attributes) {

        //                 for (const attribute of data.attributes) {
        //                     const addAttributeForm = {
        //                         attribute_id: attribute.attribute_id,
        //                         category_attribute_id: attribute.category_attribute_id,
        //                         name: attribute.name,
        //                         value: attribute.values
        //                     }; 
        //                     this.attributeForm.addControl(attribute.category_attribute_id, new FormControl('', Validators.required));
        //                     this.attributeFormsArray.push(addAttributeForm);
                            
        //                 }
        //             }
        //         });

        //     });
        // }

    if(this.selectedRowData){
      console.log(this.selectedRowData)
    }
  }



  isStockZeroOrNegative(form: FormGroup): boolean {
    const stockControl = form.get('stock');
    if (stockControl?.value <= 0) {
        return true;
    } else {
        return false;
    }
  }

  isPriceZeroOrNegative(form: FormGroup): boolean {
      const priceControl = form.get('price');
      if (priceControl?.value <= 0) {
          return true;
      } else {
          return false;
      }
  }

  showAttribute(category: string){
    // this.categoryAttributes = this.category_service.getCategoryAttribute(category).pipe(map((Response: any) => formatAdminCategoriesAttribute(Response)));
    // this.categoryAttributes.subscribe((data: NewAdminCategory) => {
    //     if (data && data.attributes) {
            
    //         for (const attribute of data.attributes) {
    //             const addAttributeForm = {
    //                 id: attribute.category_attribute_id,
    //                 name: attribute.name,
    //                 value: ''
    //             }; 
    //             this.attributeForm.addControl(attribute.category_attribute_id, new FormControl('', Validators.required));
    //             this.attributeFormsArray.push(addAttributeForm);
                
    //         }
    //     }
    // });
    console.log(category)
  }

  onCategorySelect(event: any) {
    const selectedValue = event.target.value;
    // this.editAttributes = true
    // this.addAttributeForm.reset()
    // this.attributeFormsArray.splice(0)
    const formGroup = this.attributeForm; 
    const controlNames = Object.keys(formGroup.controls);
    controlNames.forEach((controlName) => {
        formGroup.removeControl(controlName);
    });

    this.categoryAttributes = this.category_service.getCategoryAttribute(selectedValue).pipe(map((Response: any) => formatAdminCategoriesAttribute(Response)));
    this.categoryAttributes.subscribe((data: NewAdminCategory) => {
        if (data && data.attributes) {
            
            for (const attribute of data.attributes) {
                const addAttributeForm = {
                    id: attribute.category_attribute_id,
                    name: attribute.name,
                    value: ''
                }; 
                this.attributeForm.addControl(attribute.category_attribute_id, new FormControl('', Validators.required));
                this.attributeFormsArray.push(addAttributeForm);
                
            }
        }
    });
  }

  onVariantAddSubmit(){
    console.log(this.variantForm)
  }

  onVariantEditSubmit(){
    console.log(this.variantForm)
  }
  cancelAdd(){
      this.cancelVariant.emit()
  }
}
