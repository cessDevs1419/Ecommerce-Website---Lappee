import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, throwError } from 'rxjs';
import { AttributesService } from 'src/app/services/attributes/attributes.service';
import { RestocksService } from 'src/app/services/restock/restocks.service';
import { formatRestockProductList } from 'src/app/utilities/response-utils';
import { RestockProducts } from 'src/assets/models/restock';

@Component({
  selector: 'app-restock-form',
  templateUrl: './restock-form.component.html',
  styleUrls: ['./restock-form.component.css']
})
export class RestockFormComponent {

  formColor: string = "dark-form-bg"
  formTextColor: string = "dark-theme-text-color"
  formInputColor: string = "text-white"
  formBorderColor: string = "border-grey"
  pagebordercolor: string = 'linear-gradient-border'


  @Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
	@Output() ProductWarning: EventEmitter<any> = new EventEmitter();
  @Output() Select: EventEmitter<any> = new EventEmitter();

  selectedAttributeForm: FormGroup;
  addRestocksForm: FormGroup

  private isFormSave = false
  public searchString: string;
  
  hideStocksValidationContainer: boolean = true;
  stockBorder: boolean = false;
  name: boolean = false;
  products: Observable<RestockProducts[]>;
  activeButtonIndex: number | null = null;
  rowActionVisibility: boolean[] = [];
  variantForms: any[] = []; 
  variantsLists: any[] =[]
  items: any[] = [];



  constructor(private formBuilder: FormBuilder,
      private restock: RestocksService,
      private attribute_service: AttributesService,
    ){
    this.selectedAttributeForm = this.formBuilder.group({});
    this.addRestocksForm = this.formBuilder.group({
      new_stock: ['', Validators.required],
    });
  }
  ngOnInit(): void{
    this.products = this.restock.getRestockProducts().pipe(map((Response: any) => formatRestockProductList(Response)));
  }
  showAction(rowIndex: number) {
		this.rowActionVisibility[rowIndex] = !this.rowActionVisibility[rowIndex];

		for (let i = 0; i < this.rowActionVisibility.length; i++) {
			if (i !== rowIndex) {
				this.rowActionVisibility[i] = false;
			}
		}
		
		if (this.activeButtonIndex === rowIndex) {

			this.activeButtonIndex = null;
		} else {
			this.activeButtonIndex = rowIndex;
		}
	}

  showRestocksForms(){
      if (!this.isFormSave || this.variantForms.length < 1) {
        const newIndex = this.variantForms.length; 
        this.variantForms.push({ index: newIndex, isVisible: true }); 
        
        this.addRestocksForm = this.formBuilder.group({
          new_stock: [`Stock ${newIndex}`, Validators.required], 
        });

        this. hideStocksValidationContainer = false
        this.isFormSave = true;
    }else{
        const productWarn = {
            head: 'Add Product',
            sub: 'Save Before You Add Another One!'
        };
        this.ProductWarning.emit(productWarn)
    }
  }

  toggleAccordion(index: number) {
    for (let i = 0; i < this.variantForms.length; i++) {
        if (i !== index) {
            this.variantForms[i].isVisible = false;
        }
    }
    this.variantForms[index].isVisible = !this.variantForms[index].isVisible;

  }

  isStockZeroOrNegative(form: FormGroup): boolean {
    const stockControl = form.get('stock');
    if (stockControl?.value <= 0) {
        return true;
    } else {
        return false;
    }
  }

  isChecked(item: any): boolean{
    const selectedAttributes = this.attribute_service.getSelectedAttribute();
    return selectedAttributes.includes(item); 
  }


  onCheckboxChange(item: any) {
      const selectedAttributes = this.attribute_service.getSelectedAttribute();
      if (selectedAttributes.includes(item)) {
          const index = selectedAttributes.indexOf(item);
          if (index !== -1) {
              selectedAttributes.splice(index, 1);
          }
      } else {
          selectedAttributes.push(item);

      }
  }
  createAttributeFormGroup(val: any, stock: any): FormGroup {
    return this.formBuilder.group({
      variant_id: [val.variant_id],
      name: [val.name],
      stock: [stock],
    });
  }

  saveRestock(index: number){
    const stock =  this.addRestocksForm.get('new_stock')?.value
    const selectedAttributes = this.attribute_service.getSelectedAttribute();


    for (let val of selectedAttributes) {
      // Check if a form group with the same variant_id already exists
      const existingFormGroup = this.variantsLists.find(
        (group: FormGroup) => group.value.variant_id === val.variant_id
      );
  
      if (existingFormGroup) {
        // Update values of the existing form group
        existingFormGroup.patchValue({
          name: val.name,
        });
      } else {
        // Create a new form group and add it to variantsLists
        const newAttributeFormGroup = this.formBuilder.group({
          variant_id: [val.variant_id],
          name: [val.name],
          stock: [stock],
        });
        this.variantsLists.push(newAttributeFormGroup);
      }
    }


    this.isFormSave = false;
    this. hideStocksValidationContainer = true
    this.toggleAccordion(index);

    
  }

  editVariant(index: any){
    this.toggleAccordion(index) 
    // this.hideVariantValidationContainer = false
    // this.addBtn = false;
    // this.editBtn = true;
    // this.editAttributes = false
    // this.editImages = false
    // this.addVariantForm.patchValue({
    //     name: this.variantsLists[index].value.name,
    //     stock: this.variantsLists[index].value.stock,
    //     price: this.variantsLists[index].value.price,
    // });
  }

  selectVariantItem( index: number){
    this.removeVariant(index)
  }

  removeVariant(index: any){
      // const attributesArray = this.addRestocksForm.get('attributes') as FormArray;
      // const imagesArray = this.addRestocksForm.get('images') as FormArray;
      // const myStyle = this.addRestocksForm.get('images') as FormArray;
      // const variants = this.addRestocksForm.get('variants') as FormArray;

      // // variants.removeAt(index)

      // if(this.variantForms.length < 1){
      //     this.hideStocksValidationContainer = true
      // }
      // while (attributesArray.length !== 0) {
      //     attributesArray.removeAt(0);
      // }
      // this.variantsLists.splice(index);
      // while (imagesArray.length !== 0) {
      //     imagesArray.removeAt(0);
      //     imagesArray.clear();
      // }
      // while (myStyle.length !== 0) {
      //     myStyle.removeAt(0);
      //     myStyle.clear();
      // }
      // this.isFormSave = false;
  }

  saveAll(){

    const variantsLists = this.variantsLists
    const formData: FormData = new FormData();

    for (let i = 0; i < variantsLists.length; i++) {
      const variantFormGroup = variantsLists.at(i) as FormGroup;
      const variant = variantFormGroup.value;
  
      formData.append(`contents[${i}][variant_id]`, variant.variant_id);
      formData.append(`contents[${i}][quantity]`, variant.stock);

    }      
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    this.restock.postRestocks(formData).subscribe({
      next: (response: any) => { 
          
          const productSuccess = {
              head: 'Add Product',
              sub: response.message
          };
      
          this.ProductSuccess.emit(productSuccess);
          this.variantsLists.splice(0)
 
      },
      error: (error: HttpErrorResponse) => {
          if (error.error?.data?.error) {
              const fieldErrors = error.error.data.error;
              const errorsArray = [];
          
              for (const field in fieldErrors) {
                  if (fieldErrors.hasOwnProperty(field)) {
                      const messages = fieldErrors[field];
                      let errorMessage = messages;
                      if (Array.isArray(messages)) {
                          errorMessage = messages.join(' '); // Concatenate error messages into a single string
                      }
                      errorsArray.push(errorMessage);
                  }
              }
          
              const errorDataforProduct = {
                  head: 'Error Invalid Inputs',
                  sub: errorsArray,
              };
          
              this.ProductWarning.emit(errorDataforProduct);
          } else {
          
              const errorDataforProduct = {
                  head: 'Error Invalid Inputs',
                  sub: 'Please Try Another One',
              };
              this.ProductError.emit(errorDataforProduct);
          }
          return throwError(() => error);
          
      }
    });
  }

}
