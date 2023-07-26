import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class VariantsService {
  private variants: FormArray;

  constructor(private formBuilder: FormBuilder) {
    this.variants = this.formBuilder.array([]);
  }

  getVariants(): FormArray {
    return this.variants;
  }

  setVariants(variants: FormArray): void {
    this.variants = variants;
  }

  createVariantForm(): FormGroup {
    return this.formBuilder.group({
      size: ['', Validators.required],
      stock: ['', Validators.required],
      stock_limit: ['', Validators.required],
      price: [1.01, [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]],
      color: ['', [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]],
      color_title: [''],
    });
  }
}
