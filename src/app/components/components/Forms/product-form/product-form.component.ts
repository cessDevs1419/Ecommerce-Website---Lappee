import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable, map } from 'rxjs';

import { Category, Subcategory } from 'src/assets/models/categories';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { formatCategories, formatSubcategories } from 'src/app/utilities/response-utils';


@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {

    @Input() selectedRowData: any;
    @Input() formAddProduct!: boolean;
    @Input() formEditProduct!: boolean;
    @Input() formDeleteProduct!: boolean;
    @Input() formRestockProduct!: boolean;

    addProductForm: FormGroup;
	addCategoryForm: FormGroup;
	
	//Display Categories to Select
	categories!: Observable<Category[]>;
    //sub_categories!: Observable<Subcategory[]>;

	
	ngOnInit(): void{
		this.categories = this.category_service.getCategories().pipe(map((Response: any) => formatCategories(Response)));
    	//this.sub_categories = this.category_service.getCategories().pipe(map((Response: any) => formatSubcategories(Response)));
	}


    constructor(
    private category_service: CategoriesService,
    private formBuilder: FormBuilder) {
      this.addProductForm = this.formBuilder.group({
        product_name: ['', Validators.required],
        product_quantity: [null, Validators.required],
        product_price: [null, Validators.required],
        product_currency: ['', Validators.required],
        product_category: ['', Validators.required],
        product_description: [''],
        product_images: this.formBuilder.array([]),
      });
    }
    
    get product_images(): FormArray {
      return this.addProductForm.get('product_images') as FormArray;
    }
    
    selectFile() {
      const fileInput = document.getElementById('images');
      fileInput?.click();
    }
    
    handleFileInput(event: any) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileControl = this.formBuilder.control(file);
        this.product_images.push(fileControl);
      }
    }
    
    removeImage(index: number) {
      this.product_images.removeAt(index);
    }
    
    onProductSubmit(): void {
      if (this.addProductForm.invalid) {
        // Handle form validation errors
        return;
      }
      const formData = this.addProductForm.value;
      // Process the form data as needed
      console.log(this.addProductForm.value);
    }

}
