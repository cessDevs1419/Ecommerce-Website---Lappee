import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class VariantsService {
  private variantsList: FormArray = this.formBuilder.array([]);
  private variantData: any;
  
  constructor(private formBuilder: FormBuilder) {
  }

  getVariants(): FormArray {
      return this.variantsList;
  }
  
  editVariants(): FormArray {
    return this.variantData;
  }
  
  setVariants(variants: FormArray): void {
      this.variantData = variants;
  }

  createVariantForm(): FormGroup {
    return this.formBuilder.group({
      size: ['', Validators.required],
      stock: ['', Validators.required],
      stock_limit: ['', Validators.required],
      price: [1.01, [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]],
      color: ['', [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]],
      color_title: [''],
    }, { validators: this.stockHigherThanLimitValidator });
  }
  
  addVariantToVariantsList(variantFormGroup: FormGroup): void {
      this.variantsList.push(variantFormGroup);
  }
  
  stockHigherThanLimitValidator(control: FormGroup): { [key: string]: boolean } | null {
      const stockControl = control.get('stock');
      const stockLimitControl = control.get('stock_limit');

      if (stockControl && stockLimitControl) {
          const stockValue = stockControl.value;
          const stockLimitValue = stockLimitControl.value;

          if (stockValue !== null && stockLimitValue !== null && stockValue <= stockLimitValue) {
              stockControl.setErrors({ stockNotHigherThanLimit: true });
              return { stockNotHigherThanLimit: true };
          } else {
          stockControl.setErrors(null);
      }
    }

    return null;
}
}
