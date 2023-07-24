import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormsDataService {
  private formData: any = {};

  constructor(private fb: FormBuilder) {}

  // Save form data to the service
  saveFormData(data: any) {
    this.formData = { ...data };
  }

  // Retrieve form data from the service
  getFormData(): any {
    return this.formData;
  }

  // Clear form data from the service
  clearFormData() {
    this.formData = {};
  }
}
