import { Component, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable, Subscription, combineLatest, map, switchMap, throwError } from 'rxjs';

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
    
    @ViewChild('priceInput', { static: false }) priceInputRef!: ElementRef<HTMLInputElement>;
	
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
    edit_sub_categories!: Observable<AdminSubcategory[]>;
	filteredSubCategories!: Observable<AdminSubcategory[]>;
    selectedSubCategory: null;
    hideselectedsub: boolean = true;
    product_sub: '';
    
	
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
	        name: ['', Validators.required],
            price: [1, Validators.required],
	        stock: ['', Validators.required],
            stock_limit: ['', Validators.required],
            category: ['', Validators.required],
            subcategory: ['', Validators.required],
	        description: [''],
	        //images: this.formBuilder.array([]),
	    });
	    
		this.editProductForm = this.formBuilder.group({
            name: [''],
            price: [''],
            stock_limit: [''],
	        category: ['', Validators.required],
            subcategory: [''],
	        description: [''],
	    });
	    
        this.deleteProductForm = new FormGroup({
            product_id: new FormControl('', Validators.required)
        });
        
        this.restockProductForm = new FormGroup({
            product_name: new FormControl('', Validators.required),
            product_quantity: new FormControl('', Validators.required)
        });
    }

	ngOnInit(): void{
		this.categories = this.category_service.getAdminCategories().pipe(map((Response: any) => formatAdminCategories(Response)));
    	this.sub_categories = this.sub_category_service.getAdminSubcategories().pipe(map((Response: any) => formatAdminSubcategories(Response)));
        this.addProductForm.valueChanges.subscribe(() => {
            this.updateBorders();
        });
        

        this.edit_sub_categories = this.sub_category_service.getAdminSubcategories().pipe(
            map((Response: any) => formatAdminSubcategories(Response)), 
            map((adminSubcategories: AdminSubcategory[]) => {
                const selectedSubCategoryId = this.selectedRowData.sub_category_id; 
                return adminSubcategories.filter(subCategory => subCategory.id === selectedSubCategoryId);
            })
        );


	}

    isDecimal(value: number): boolean {
        const valueString = value.toString();
        return /^\d+(\.\d{3,3})?$/.test(valueString);
    }
    
    onCategorySelect(event: any): void {
        this.hideselectedsub = false;
        const categoryId = event.target.value;
        if (categoryId) {
            this.editProductForm.patchValue({
                subcategory: null // Set the value of 'subcategory' form control to null
            });
            this.selectedSubCategory = null;
            this.filteredSubCategories = this.sub_categories.pipe(
                map((subCategories: AdminSubcategory[]) =>
                    subCategories.filter(subCategory => subCategory.main_category === categoryId)
                )
            );
        }
    }
    
    isFormEmpty(): boolean {
        const formValues = this.editProductForm.value;
        return Object.values(formValues).every(value => !value);
    }
    
	//Get Image Value to Array
    get product_images(): FormArray {
        return this.addProductForm.get('images') as FormArray;
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
        const productPrice = this.addProductForm.get('price')?.value;
        const productStock = this.addProductForm.get('stock')?.value;
        const productStockLimit = this.addProductForm.get('stock_limit')?.value;
        
        
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

        
        let formData: any = new FormData();
        formData.append('name', this.addProductForm.get('name')?.value);
        formData.append('stock', this.addProductForm.get('stock')?.value);
        formData.append('limit', this.addProductForm.get('stock_limit')?.value);
        formData.append('price', this.addProductForm.get('price')?.value);
        formData.append('category', this.addProductForm.get('subcategory')?.value);
        formData.append('description', this.addProductForm.get('description')?.value);
        
        if(this.addProductForm.valid){
            this.product_service.postProduct(formData).subscribe({
                next: (response: any) => { 
                    this.RefreshTable.emit();
                    this.ProductSuccess.emit("Product "+this.addProductForm.value.name);
                    this.addProductForm.reset();
                },
                error: (error: HttpErrorResponse) => {
                    const errorData = this.errorService.handleError(error);
                
                    if (errorData.errorMessage === 'Unexpected Error') {
                            this.ProductError.emit(errorData);
                    }else if (errorData.errorMessage === 'Invalid input') {
                        
                        if(this.editProductForm.get('subcategory')?.value === null){
                            const errorMessage = {
                                errorMessage: 'Invalid Request',
                                suberrorMessage: 'sub category is required! ',
                            }
                            this.ProductError.emit(errorMessage);
                        }else {
                            const errorMessage = {
                                errorMessage: 'Invalid Request',
                                suberrorMessage: 'There are no changes were made',
                            }
                            this.ProductError.emit(errorMessage);
                        }

                    }else if (errorData.errorMessage === 'Unprocessable Entity') {
                        if(error.error.data.error){
                            const errorMessage = {
                                errorMessage: 'Unprocessable Entity',
                                suberrorMessage: error.error.data.error.limit || error.error.data.error.category  || error.error.data.error.price,
                            };
                            
                            this.ProductWarning.emit(errorMessage);
                        }
                    }
                    return throwError(() => error);
                }
            });
                
        } else{
            this.addProductForm.markAllAsTouched();
            const emptyFields = [];
            for (const controlName in this.addProductForm.controls) {
                if ( this.addProductForm.controls.hasOwnProperty(controlName)) {
                    const control = this.addProductForm.controls[controlName];
                    if (control.errors?.['required'] && control.invalid) {
                        const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                        emptyFields.push(label);
                    }
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
        let formData: any = new FormData();
        
        // Common FormData appending logic
        formData.append('id', this.selectedRowData.id);
        formData.append('name', this.editProductForm.get('name')?.value || this.selectedRowData.name);
        formData.append('price', this.editProductForm.get('price')?.value || this.selectedRowData.price);
        formData.append('limit', this.editProductForm.get('stock_limit')?.value || this.selectedRowData.stock_limit);
        formData.append('description', this.editProductForm.get('description')?.value || this.selectedRowData.description);
        formData.append('category', this.editProductForm.get('subcategory')?.value || this.selectedRowData.sub_category_id);

            
            this.product_service.patchProduct(formData).subscribe({
                next: (response: any) => { 
                    this.RefreshTable.emit();
                    this.ProductSuccess.emit("Product "+this.editProductForm.value.product_name);
                },
                error: (error: HttpErrorResponse) => {
                    const errorData = this.errorService.handleError(error);
                
                    if (errorData.errorMessage === 'Unexpected Error') {
                            this.ProductError.emit(errorData);
                    }else if (errorData.errorMessage === 'Invalid input') {
                        
                        if(this.editProductForm.get('subcategory')?.value === null){
                            const errorMessage = {
                                errorMessage: 'Invalid Request',
                                suberrorMessage: 'sub category is required! ',
                            }
                            this.ProductError.emit(errorMessage);
                        }else {
                            const errorMessage = {
                                errorMessage: 'Invalid Request',
                                suberrorMessage: 'There are no changes were made',
                            }
                            this.ProductError.emit(errorMessage);
                        }

                    }else if (errorData.errorMessage === 'Unprocessable Entity') {
                        const errorMessages: string[] = [];
                    
                        // Check if errorData.data.error is not null or undefined
                        if (errorData.data && errorData.data.error) {
                            for (const fieldName in errorData.data.error) {
                                if (Object.prototype.hasOwnProperty.call(errorData.data.error, fieldName)) {
                                    const fieldErrors: string[] = errorData.data.error[fieldName];
                                    const errorMessage = `${fieldName}: ${fieldErrors.join(', ')}`;
                                    errorMessages.push(errorMessage);
                                }
                            }
                            const errorFields = errorMessages.join(' | ');
                            const errorMessage = {
                                errorMessage: 'Unprocessable Entity',
                                suberrorMessage: errorFields,
                            }
                            this.ProductWarning.emit(errorMessage);
                            
                            
                        } else {
                            const errorMessage = {
                                errorMessage: 'Unprocessable Entity',
                                suberrorMessage: 'Data may already exist or didnt change all',
                            }
                            this.ProductWarning.emit(errorMessage);
                            return throwError(() => error);
                        }
                    
    
                    } 
                
                    return throwError(() => error);
                }
            });

        
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
}
