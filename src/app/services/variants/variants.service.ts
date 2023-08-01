import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Variant } from 'src/assets/models/products';
import { DELETEVariantsAdmin, PATCHVariantsAdmin } from '../endpoints';


@Injectable({
  providedIn: 'root'
})
export class VariantsService {
  private variantsList: FormArray = this.formBuilder.array([]);
  private editedvariantsList: FormArray = this.formBuilder.array([]);
  private variantData: any;
  private databasevariantsList: any;
  private additionalvariantsList: any;
  private index: number;
  
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
  
  getVariants(): FormArray {
      return this.variantsList;
  }
  
  getEditedVariants(): FormArray {
    return this.editedvariantsList;
  }

  
  getIndex(){
    return this.index
  }
  
  editVariants(): FormArray {
    return this.variantData;
  }
  editDatabaseVariants(): FormArray {
    return this.databasevariantsList;
}
  editAdditionalVariants(): FormArray {
    return this.additionalvariantsList;
  }

  setVariants(variants: FormArray, index: number): void {
      this.variantData = variants;
      this.index = index
  }
  
  setAdditionalVariants(variants: FormArray, index: number): void {
    this.additionalvariantsList = variants;
    this.index = index
}
  setDatabaseVariants(variants: FormArray, index: number): void {
    this.databasevariantsList = variants;
    this.index = index
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
  editVariantToVariantsList(variantFormGroup: FormGroup): void {
    this.editedvariantsList.push(variantFormGroup);
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
  

  patchProduct(data: FormData): Observable<any> {
    return this.http.patch<Variant>(PATCHVariantsAdmin, data, this.httpOptions);
  } 
  

  deleteVariants(prodId: number): Observable<any> {
    return this.http.delete(DELETEVariantsAdmin, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: {
          id: prodId
        }
    })
  }
  
}
