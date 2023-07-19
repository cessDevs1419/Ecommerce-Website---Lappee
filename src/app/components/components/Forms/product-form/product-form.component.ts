import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable, map, throwError } from 'rxjs';

import { AdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { formatAdminCategories, formatAdminSubcategories} from 'src/app/utilities/response-utils';
import { ProductsService } from 'src/app/services/products/products.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlingService } from 'src/app/services/errors/error-handling-service.service';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {

	@Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
    @Output() ProductWarning: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();
    
	productSuccessMessage = 'Product: ';
	errorMessage = 'Please fill in all the required fields.';
	
    @Input() selectedRowData: any;
    @Input() formAddProduct!: boolean;
    @Input() formEditProduct!: boolean;
    @Input() formDeleteProduct!: boolean;
    @Input() formRestockProduct!: boolean;

    addProductForm: FormGroup;
	editProductForm: FormGroup;
	deleteProductForm: FormGroup;
	restockProductForm: FormGroup;
	
	//Display Categories to Select
	categories!: Observable<AdminCategory[]>;
    sub_categories!: Observable<AdminSubcategory[]>;
	filteredSubCategories!: Observable<AdminSubcategory[]>;
    selectedSubCategory: null;
    
    
	
    constructor(
	    private http: HttpClient,
	    private category_service: CategoriesService,
	    private sub_category_service: SubcategoriesService,
        private product_service: ProductsService,
        private errorService: ErrorHandlingService,
	    private formBuilder: FormBuilder
    ) 
    {
	    this.addProductForm = this.formBuilder.group({
	        product_name: ['', Validators.required],
            product_price: ['1', Validators.required],
	        product_stock: ['1', Validators.required],
            product_stock_limit: ['', Validators.required],
	        product_category: ['', Validators.required],
            product_subcategory: ['', Validators.required],
	        product_description: [''],
	        product_images: this.formBuilder.array([]),
	    });
	    
        this.restockProductForm = new FormGroup({
            product_name: new FormControl('', Validators.required),
            product_quantity: new FormControl('', Validators.required)
        });
	    
		this.editProductForm = this.formBuilder.group({
            //product_id: ['', Validators.required],
	        product_name: ['', Validators.required],
	        product_quantity: [Number, Validators.required],
	        product_price: ['', Validators.required],
	        product_currency: ['', Validators.required],
	        product_category: ['', Validators.required],
            product_subcategory: ['', Validators.required],
	        product_description: [''],
	        product_images: this.formBuilder.array([]),
	    });
	    
        this.deleteProductForm = new FormGroup({
            product_id: new FormControl('', Validators.required)
        });

    }
    
	ngOnInit(): void{
		this.categories = this.category_service.getAdminCategories().pipe(map((Response: any) => formatAdminCategories(Response)));
    	this.sub_categories = this.sub_category_service.getAdminSubcategories().pipe(map((Response: any) => formatAdminSubcategories(Response)));
        this.addProductForm.valueChanges.subscribe(() => {
            this.updateBorders();
        });
	}
	
    onCategorySelect(event: any): void {
        const categoryId = event.target.value;
        if (categoryId) {
            this.selectedSubCategory = null;
            this.filteredSubCategories = this.sub_categories.pipe(
                map((subCategories: AdminSubcategory[]) =>
                    subCategories.filter(subCategory => subCategory.main_category === categoryId)
                )
            );
        }
    }
    
    
	//Get Image Value to Array
    get product_images(): FormArray {
        return this.addProductForm.get('product_images') as FormArray;
    }
    
    selectFileForAdding() {
        const addInput = document.getElementById('addimages');
        addInput?.click();

    }
    
    selectFileForEditing() {
        const editInput = document.getElementById('editimages');
        editInput?.click();
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
    
    
    updateBorders(): void {
        const productPrice = this.addProductForm.get('product_price')?.value;
        const productStock = this.addProductForm.get('product_stock')?.value;
        const productStockLimit = this.addProductForm.get('product_stock_limit')?.value;
        
        
        const priceInput = document.getElementById('addproductPrice') as HTMLInputElement;
        const stockInput = document.getElementById('addproductQty') as HTMLInputElement;
        const stocklimitInput = document.getElementById('addproductQtyLimit') as HTMLInputElement;

        if (stockInput && stocklimitInput) {
            //warning to inbalance stock and limit
            stockInput.classList.toggle('border-warning', productStock < productStockLimit);
            stocklimitInput.classList.toggle('border-warning', productStock < productStockLimit);
            
            //danger for invalid input
            stockInput.classList.toggle('border-danger', productStock < 1);
            priceInput.classList.toggle('border-danger', productPrice < 1);
        }
    }
    
    //Submit Functions
    onProductAddSubmit(): void {

        if(this.addProductForm.valid){
            const formData = this.addProductForm.value;
            console.log(this.addProductForm.value);
            this.ProductSuccess.emit(this.productSuccessMessage +this.addProductForm.value.product_name);
            this.addProductForm.reset();
            this. product_images.clear();
            // let formData: any = new FormData();
            // formData.append('name', this.addProductForm.get('product_name')?.value);
            // formData.append('stock', this.addProductForm.get('product_quantity')?.value);
            // formData.append('stock-limit', this.addProductForm.get('product_quantity_limit')?.value);
            // formData.append('price', this.addProductForm.get('product_price')?.value);
            // formData.append('sub_category_id', this.addProductForm.get('product_category')?.value);
            // formData.append('description', this.addProductForm.get('product_description')?.value);
            // formData.append('product_variants', this.addProductForm.get('product_variant')?.value);
    
            // for(const value of formData.entries()){
            //     console.log(`${value[0]}, ${value[1]}`);
            // }
            
            // this.product_service.postProduct(formData).subscribe({
            //     next: (response: any) => { 
            //         console.log(response);
            //         this.ProductSuccess.emit("Product "+this.addProductForm.value.product_name);
            //         this.addProductForm.reset();
            //     },
            //     error: (error: HttpErrorResponse) => {
            //         return throwError(() => error)
            //     }
            // });
        
        }else{
            this.addProductForm.markAllAsTouched();
            const emptyFields = [];
            for (const controlName in this.addProductForm.controls) {
                if (this.addProductForm.controls.hasOwnProperty(controlName) && this.addProductForm.controls[controlName].errors?.['required']) {
                    const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                    emptyFields.push(label);
                }
            }

            const errorData = {
                errorMessage: this.errorMessage,
                suberrorMessage: emptyFields.join(', ')
            };
            this.ProductError.emit(errorData);
        }
        
    
    }

    onProductRestockSubmit(): void {
        
        if(this.restockProductForm.valid){
            const formData = this.restockProductForm.value;
            console.log(this.restockProductForm.value);
            this.ProductSuccess.emit(this.productSuccessMessage +this.restockProductForm.value.product_name);
            this.restockProductForm.reset();
            
            // let formData: any = new FormData();
            // formData.append('name', this.restockProductForm.get('product_name')?.value);
            // formData.append('stock', this.restockProductForm.get('product_quantity')?.value);
            // formData.append('stock-limit', this.restockProductForm.get('product_quantity_limit')?.value);

            // for(const value of formData.entries()){
            //     console.log(`${value[0]}, ${value[1]}`);
            // }
            
            // this.product_service.postProduct(formData).subscribe({
            //     next: (response: any) => { 
            //         console.log(response);
            //         this.ProductSuccess.emit("Product "+this.restockProductForm.value.product_name);
            //         this.restockProductForm.reset();
            //     },
            //     error: (error: HttpErrorResponse) => {
            //         return throwError(() => error)
            //     }
            // });
        
        }else{
            this.restockProductForm.markAllAsTouched();
            const emptyFields = [];
            for (const controlName in this.restockProductForm.controls) {
                if (this.restockProductForm.controls.hasOwnProperty(controlName) && this.restockProductForm.controls[controlName].errors?.['required']) {
                    const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                    emptyFields.push(label);
                }
            }

            const errorData = {
                errorMessage: this.errorMessage,
                suberrorMessage: emptyFields.join(', ')
            };
            this.ProductError.emit(errorData);
        }
        
        
    }
    
    onProductEditSubmit(): void {
        
        if(this.editProductForm.valid){
            const formData = this.editProductForm.value;
            console.log(this.editProductForm.value);
            this.ProductSuccess.emit(this.productSuccessMessage+this.editProductForm.value.product_name);
            this.editProductForm.reset();
            this. product_images.clear();
            // let formData: any = new FormData();
            // formData.append('name', this.editProductForm.get('product_name')?.value);
            // formData.append('stock', this.editProductForm.get('product_quantity')?.value);
            // formData.append('stock-limit', this.editProductForm.get('product_quantity_limit')?.value);
            // formData.append('price', this.editProductForm.get('product_price')?.value);
            // formData.append('sub_category_id', this.editProductForm.get('product_category')?.value);
            // formData.append('description', this.editProductForm.get('product_description')?.value);
            // formData.append('product_variants', this.editProductForm.get('product_variant')?.value);
    
            // for(const value of formData.entries()){
            //     console.log(`${value[0]}, ${value[1]}`);
            // }
            
            // this.product_service.postCategory(formData).subscribe({
            //     next: (response: any) => { 
            //         console.log(response);
            //         this.ProductSuccess.emit("Product "+this.editProductForm.value.product_name);
            //         this.editProductForm.reset();
            //     },
            //     error: (error: HttpErrorResponse) => {
            //         return throwError(() => error)
            //     }
            // });
        
        }else{
            this.editProductForm.markAllAsTouched();
            const emptyFields = [];
            for (const controlName in this.editProductForm.controls) {
                if (this.editProductForm.controls.hasOwnProperty(controlName) && this.editProductForm.controls[controlName].errors?.['required']) {
                    const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                    emptyFields.push(label);
                }
            }

            const errorData = {
                errorMessage: this.errorMessage,
                suberrorMessage: emptyFields.join(', ')
            };
            this.ProductError.emit(errorData);
        }
        
    }
    
    onProductDeleteSubmit(): void {
        this.product_service.deleteProduct(this.selectedRowData.id).subscribe({
            next: (response: any) => { 
                console.log(response)
                this.RefreshTable.emit();
                this.ProductSuccess.emit("Product  "+this.selectedRowData.name);
                this.deleteProductForm.reset();
            },
            error: (error: HttpErrorResponse) => {
                const errorData = this.errorService.handleError(error);
                if (errorData.errorMessage === 'Unexpected Error') {
                    this.ProductError.emit(errorData);
                } else {
                    this.ProductWarning.emit(errorData);
                }
                return throwError(() => error); 
            }
        });
        
    }
}
