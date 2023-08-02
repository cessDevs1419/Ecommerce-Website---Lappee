import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, Subscription, combineLatest, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';

import { AdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { formatAdminCategories, formatAdminSubcategories, formatProducts} from 'src/app/utilities/response-utils';
import { ProductsService } from 'src/app/services/products/products.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlingService } from 'src/app/services/errors/error-handling-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsDataService} from 'src/app/services/forms/forms-data.service';
import { VariantsService } from 'src/app/services/variants/variants.service';
import { Product } from 'src/assets/models/products';
import { Location } from '@angular/common';
import { Variant } from 'src/assets/models/products';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
    
    @ViewChild('priceInput', { static: false }) priceInputRef!: ElementRef<HTMLInputElement>;
    @ViewChild('openModalBtn') openModalBtn!: ElementRef;
    
	@Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
    @Output() ProductWarning: EventEmitter<any> = new EventEmitter();
    @Output() CloseModal: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();
    @Output() DeleteVariant: EventEmitter<any> = new EventEmitter<any>();

	productSuccessMessage = 'Product: ';
	errorMessage = 'Please fill in all the required fields.';
	
    @Input() selectedRowData: any;
    @Input() formAddProduct!: boolean;
    @Input() formEditProduct!: boolean;
    @Input() formAddVariant!: boolean;
    @Input() formAdditionalVariant!: boolean;
    @Input() formEditVariant!: boolean;
    @Input() formDeleteProduct!: boolean;
    @Input() formDeleteVariant!: boolean;
    @Input() formRestockProduct!: boolean;
    @Input() formEditDatabaseVariant!: boolean;
    @Input() formEditAdditionalVariant!: boolean;
    
    addProductForm: FormGroup;
    addVariantForm: FormGroup;
	editProductForm: FormGroup;
	editVariantForm: FormGroup;
	editDatabaseVariantForm: FormGroup;
	deleteProductForm: FormGroup;
	deleteVariantForm: FormGroup;
	restockProductForm: FormGroup;
    
	
	categories!: Observable<AdminCategory[]>;
    sub_categories!: Observable<AdminSubcategory[]>;
    edit_sub_categories!: Observable<AdminSubcategory[]>;
	filteredSubCategories!: Observable<AdminSubcategory[]>;
    products!: Observable<Product[]>;
    products_sub!: Observable<Product[]>;
    
    variantsList: FormArray = this.formBuilder.array([]);
    placeVariantTolist: any[] = [];
    editedvariantsList: FormArray = this.formBuilder.array([]);
    variantId: FormArray = this.formBuilder.array([]);
    selectedDeleteVariant: Variant | undefined;
    
    selectedSubCategory: null;
    hideselectedsub: boolean = true;
	showForm: boolean = false;
    selectedVariants: any[] = [];
    selectedSubCategoryId: string;
    
    index: number;
    done: boolean;
    cancel: boolean = true; 
    
    constructor(
	    private http: HttpClient,
	    private category_service: CategoriesService,
	    private sub_category_service: SubcategoriesService,
        private product_service: ProductsService,
        private errorService: ErrorHandlingService,
	    private formBuilder: FormBuilder,
	    private router: Router,
	    private formDataService: FormsDataService,
	    private variantService: VariantsService,
	    private location: Location
    ) 
    {
        //get variants
        this.variantsList = this.variantService.getVariants()
        //patch Variants to Form
        
        //products
	    this.addProductForm = this.formBuilder.group({
	        name: ['', Validators.required],
            category: ['', Validators.required],
            subcategory: ['', Validators.required],
	        description: ['', Validators.required],
	        images: this.formBuilder.array([]),

            //Variants
            variants: this.variantsList,
	    });
	    
		this.editProductForm = this.formBuilder.group({
            name: [''],
            category: [''],
            subcategory: [''],
	        description: [''],
	        //images: this.formBuilder.array([]),

            //Variants
            variants: this.variantsList,
	    });
	    
        this.deleteProductForm = new FormGroup({
            product_id: new FormControl('', Validators.required)
        });
        
        //variants
        this.addVariantForm = this.formBuilder.group({
            size: ['', Validators.required],
            stock: ['', Validators.required],
            stock_limit: ['', Validators.required],
            price: [1.01, [Validators.required]], //Validators.pattern(/^\d+\.\d{1,2}$/)  
            color: ['', [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]],
            color_title: ['', Validators.required],
        },{ validators: this.stockHigherThanLimitValidator });
        
        this.editVariantForm = this.formBuilder.group({
            variant_id: [''],
            size: ['', Validators.required],
            stock: ['', Validators.required],
            stock_limit: ['', Validators.required],
            price: [1.01, [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]],
            color: ['', [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]],
            color_title: [''],
        },{ validators: this.stockHigherThanLimitValidator });
        
        this.deleteVariantForm = new FormGroup({
            variant_id: new FormControl('', Validators.required)
        });
        
    }

	ngOnInit(): void{
		this.categories = this.category_service.getAdminCategories().pipe(map((Response: any) => formatAdminCategories(Response)));
        this.sub_categories = this.sub_category_service.getAdminSubcategories().pipe(map((Response: any) => formatAdminSubcategories(Response)));
        this.products = this.product_service.getAdminProducts().pipe(map((Response: any) => formatProducts(Response)));
        //this.editVariantForm = this.variantService.editVariants();

        this.edit_sub_categories = this.sub_category_service.getAdminSubcategories().pipe(
            map((Response: any) => formatAdminSubcategories(Response)), 
            map((adminSubcategories: AdminSubcategory[]) => {
                const selectedSubCategoryId = this.selectedRowData.sub_category_id; 
                return adminSubcategories.filter(subCategory => subCategory.id === selectedSubCategoryId);
            })
        );
        
        const savedFormData = this.formDataService.getFormData();
        if (savedFormData) {
            this.addProductForm.patchValue(savedFormData);
        }
    
        this.addProductForm.valueChanges.subscribe((formData) => {
            this.formDataService.saveFormData(formData);
        });

        this.products.subscribe((products: any[]) => { 
            const name = products.find(products => products.id === this.selectedRowData)?.name || 'error';
            const description = products.find(products => products.id === this.selectedRowData)?.description || 'error';
    
            this.editProductForm.patchValue({
                name: name ? name : null,
                description: description ? description : null,
            });
    
        });
        
        
        const editVariantData = this.variantService.getVariantFromEditForm();

        if (editVariantData) {
            this.editVariantForm = editVariantData.form;
            this.index = editVariantData.index;
        }
        
        const selectedRowData = this.selectedRowData;
        this.products
	}

    //Validate
    stockHigherThanLimitValidator(control: AbstractControl): ValidationErrors | null {
        const stockControl = control.get('stock');
        const stockLimitControl = control.get('stock_limit');
    
        if (stockControl && stockLimitControl) {
            const stockValue = stockControl.value;
            const stockLimitValue = stockLimitControl.value;
    
            if (stockValue !== null && stockLimitValue !== null && stockValue <= stockLimitValue) {
                stockControl.setErrors({ stockNotHigherThanLimit: true });
                return { stockNotHigherThanLimit: true };
            } else {
            // Reset the error when the condition is met
            stockControl.setErrors(null);
        }
        }
    
        return null;
    }
    
    isHexColor(color: string | null): boolean { 
        if (!color) return false;
        const hexColorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexColorPattern.test(color);
    }
    
    isFormEmpty(): boolean {
        const formValues = this.editProductForm.value;
        return Object.values(formValues).every(value => !value);
    }
    
    asyncTask(): Promise<void> {
        // Simulate an asynchronous task with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            }, 1500); 
        });
    }
    
    //Add Variant tools
    showForms(value: any) {
        switch(value){
            case 'edit' : 
                this.showForm = true;
                this.router.navigate(['/admin/product-management','variant','additional']);
            break
            
            default :
                this.showForm = true;
                this.router.navigate(['/admin/product-management','variant','add']);
            break
        }
        
    }
    
    back() {
        this.location.back();
    }
    
    cancelthis() {
        this.location.back();
        this.addProductForm.reset();
        this.editProductForm.reset();
        this.variantsList.clear();
        this.editedvariantsList.clear();
    }
    
    toAddPage(): void {
        this.router.navigate(['/admin/product-management', 'product', 'add']);
    }
    
    toProductPage(): void {
        this.router.navigate(['/admin/product-management']);
    }
    
    toEditPage(): void {
        this.router.navigate(['/admin/product-management', 'product', 'edit']);
    }

    
    //Place Variant to EditForm
    async editVariant(value: any, index: any): Promise<void>{
        
        this.index = index
        this.editVariantForm.patchValue({
            variant_id: value.variant_id,
            size: value.size,
            stock: value.stock,
            stock_limit: value.stock_limit,
            price: value.price,
            color: value.color,
            color_title: value.color_title,
        });
        
        console.log(this.editVariantForm)
        this.variantService.setVariantToEditForm(this.editVariantForm, index);
        
        await this.asyncTask();
        this.router.navigate(['/admin/product-management', 'variant', 'edit']);
    }
    
    //Delete Variant
    selectVariant(variant: Variant , index: number) {
        this.selectedDeleteVariant = variant
        this.index = index
        this.formDeleteVariant = true
    }
    
    //getting the id of the variant and pushed to an array
    addVariantToDelete(): void {
        if (this.selectedDeleteVariant?.variant_id) {
            this.variantId.push(this.formBuilder.control(this.selectedDeleteVariant.variant_id));
            this.removeDefaultVariants(this.variantId);
            console.log(this.variantId)
            const productSuccess = {
                head: 'Delete Variant',
                sub: 'Successfully deleted variant'
            };

            this.ProductSuccess.emit(productSuccess);
        }
    }
    
    //remove variants from array this works only for adding new variant
    removeVariants(): void {
        const index = this.index
        if (index >= 0 && index < this.variantsList.length) {
            this.variantsList.removeAt(index);
            const productSuccess = {
                head: 'Delete Variant',
                sub: 'Successfully removed variant'
            };
            
            this.ProductSuccess.emit(productSuccess);
        }
    }
    
    //just hide variants when the variants are pushed in the array ready for deleting
    removeDefaultVariants(value: FormArray): void {
        const valueArray = value.value;
        this.products = this.products.pipe(
            map(products => {
                return products.map(product => ({
                ...product,
                product_variants: product.product_variants.filter(variant => !valueArray.includes(variant.variant_id))
                }));
            })
        );
    }

    
    //select category
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
    
    extractFileName(url: string): string {
        const parts = url.split('/'); 
        return parts[parts.length - 1]; 
    }
    
    
    //Submit Functions
    
    //submit products
    async onProductAddSubmit(): Promise<void> {

        let formData: any = new FormData();
        formData.append('name', this.addProductForm.get('name')?.value);
        formData.append('category', this.addProductForm.get('subcategory')?.value);
        formData.append('description', this.addProductForm.get('description')?.value);
        
        const imageFiles = this.addProductForm.get('images')?.value;
        const imageFileNames: string[] = []; 
        
        if (imageFiles) {
            for (let i = 0; i < imageFiles.length; i++) {
                const file: File = imageFiles[i]; 
                imageFileNames.push(file.name); 
                formData.append(`images[]`, file); 
            }
        }

        //append variants to array
        const variantsList = this.addProductForm.get('variants') as FormArray;
        for (let i = 0; i < variantsList.length; i++) {
            const variantFormGroup = variantsList.at(i) as FormGroup;
            const variant = variantFormGroup.value;
            formData.append(`variants[${i}][size]`, variant.size);
            formData.append(`variants[${i}][quantity]`, variant.stock);
            formData.append(`variants[${i}][limit]`, variant.stock_limit);
            formData.append(`variants[${i}][price]`, variant.price.toFixed(2));
            formData.append(`variants[${i}][color]`, variant.color);
            formData.append(`variants[${i}][color_title]`, variant.color_title);
        }
        
        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        }
        console.log(variantsList)
        

        
        if(this.addProductForm.valid){
        
            this.product_service.postProduct(formData).subscribe({
                next: (response: any) => { 
                    
                    const productSuccess = {
                        head: 'Add Product',
                        sub: response.message
                    };
                
                    this.RefreshTable.emit();
                    this.ProductSuccess.emit(productSuccess);
                    this.addProductForm.reset();
                    this.variantsList.clear();
                    this.product_images.clear();
                    this.done = true;
                    this.cancel = false;
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
                            errorMessage: 'Error Invalid Inputs',
                            suberrorMessage: errorsArray,
                        };
                    
                        this.ProductWarning.emit(errorDataforProduct);
                    } else {
                    
                        const errorDataforProduct = {
                            errorMessage: 'Error Invalid Inputs',
                            suberrorMessage: 'Please Try Another One',
                        };
                        this.ProductError.emit(errorDataforProduct);
                    }
                    return throwError(() => error);
                    
                }
            });

        } else{

            this.addProductForm.markAllAsTouched();
            const emptyFields = [];
            for (const controlName in this.addProductForm.controls) {
                if ( this.addProductForm.controls.hasOwnProperty(controlName)) {
                    const productcontrol = this.addProductForm.controls[controlName];
                    if (productcontrol.errors?.['required'] && productcontrol.invalid ) {
                        const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                        emptyFields.push(label);
                    }
                }
            }
            
            const errorDataforProduct = {
                errorMessage: this.errorMessage,
                suberrorMessage: emptyFields.join(', ')
            };

            this.ProductError.emit(errorDataforProduct);
        }
        

    
    }
    
    async onProductEditSubmit(): Promise<void> {
        await this.onaddProductVariants();

        let formData: any = new FormData();
        formData.append('id', this.selectedRowData);
        formData.append('name', this.editProductForm.get('name')?.value);
        formData.append('category', this.editProductForm.get('subcategory')?.value);
        formData.append('description', this.editProductForm.get('description')?.value);
        
        const variantsList = this.editProductForm.get('variants') as FormArray;
        for (let i = 0; i < variantsList.length; i++) {
            const variantFormGroup = variantsList.at(i) as FormGroup;
            const variant = variantFormGroup.value;
            formData.append(`variants[${i}][size]`, variant.size);
            formData.append(`variants[${i}][quantity]`, variant.stock);
            formData.append(`variants[${i}][limit]`, variant.stock_limit);
            formData.append(`variants[${i}][price]`, variant.price);
            formData.append(`variants[${i}][color]`, variant.color);
            formData.append(`variants[${i}][color_title]`, variant.color_title);
        }

        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        }
        
        // if(this.addProductForm.valid){
        //     this.product_service.postProduct(formData).subscribe({
        //         next: (response: any) => { 
                    
        //             this.RefreshTable.emit();
        //             this.ProductSuccess.emit("Product "+this.addProductForm.value.name);
        //             this.addProductForm.reset();
        //             this.variantsList.clear();
        //         },
        //         error: (error: HttpErrorResponse) => {
        //             const errorData = this.errorService.handleError(error);
                    
        //             return throwError(() => error);
        //         }
        //     });
                
        // } else{
        //     this.addProductForm.markAllAsTouched();
        //     const emptyFields = [];
        //     for (const controlName in this.addProductForm.controls || this.addVariantForm.controls) {
        //         if ( this.addProductForm.controls.hasOwnProperty(controlName) || this.addVariantForm.controls.hasOwnProperty(controlName)) {
        //             const productcontrol = this.addProductForm.controls[controlName];
        //             const variantcontrol = this.addProductForm.controls[controlName];
        //             if (productcontrol.errors?.['required'] && productcontrol.invalid || variantcontrol.errors?.['required'] && variantcontrol.invalid) {
        //                 const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
        //                 emptyFields.push(label);
        //             }
        //         }
        //     }
            
        //     const errorDataforProduct = {
        //         errorMessage: this.errorMessage,
        //         suberrorMessage: emptyFields.join(', ')
        //     };




        //     this.ProductError.emit(errorDataforProduct);
        // }
        
        await this.asyncTask();
        this.router.navigate(['/admin/product-management']);
    }
    
    onProductDeleteSubmit(): void {
        this.product_service.deleteProduct(this.selectedRowData.id).subscribe({
            next: (response: any) => { 
                console.log(response)
                this.RefreshTable.emit();
                this.CloseModal.emit();
                this.ProductSuccess.emit("Product  "+this.selectedRowData.name);
                this.deleteProductForm.reset();
            },
            error: (error: HttpErrorResponse) => {
                const errorData = this.errorService.handleError(error);
                if (errorData.errorMessage === 'Unexpected Error') {
                    this.ProductError.emit(errorData);
                } 
                else if (errorData.errorMessage === 'Invalid Input') {
                    const customErrorMessages = {
                        errorMessage: 'Invalid Request',
                        suberrorMessage: 'Product have variants',
                    };
                    this.ProductError.emit(customErrorMessages);
                } 
                else {
                    this.ProductWarning.emit(errorData);
                }
                return throwError(() => error); 
            }
        });
        
    }

    //submit variants
    async onaddProductVariants(): Promise<void> {
        if (this.addVariantForm.valid) {
            const newVariantFormGroup = this.formBuilder.group({
                size: [this.addVariantForm.get('size')?.value, Validators.required],
                stock: [this.addVariantForm.get('stock')?.value, Validators.required],
                stock_limit: [this.addVariantForm.get('stock_limit')?.value, Validators.required],
                price: [this.addVariantForm.get('price')?.value, Validators.required],
                color: [this.addVariantForm.get('color')?.value, [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]],
                color_title: [this.addVariantForm.get('color_title')?.value],
            });
    
            this.variantService.addVariantToVariantsList(newVariantFormGroup);
            this.addVariantForm.reset();
            this.addVariantForm.markAsPristine();
            
            const successVariants = {
                head: 'Add Variant',
                sub: 'Successfully added variants'
            };

            this.ProductSuccess.emit(successVariants);
    
            //await this.asyncTask();
            //this.router.navigate(['/admin/product-management', 'product', 'add']);
        } else {
            this.addVariantForm.markAllAsTouched();
            const emptyFields = [];
    
            for (const controlName in this.addVariantForm.controls) {
                if (this.addVariantForm.controls.hasOwnProperty(controlName)) {
                    const variantControl = this.addVariantForm.controls[controlName];
                    if (variantControl.invalid) {
                        const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                        if (variantControl.errors?.['required']) {
                            emptyFields.push(label + ' is required');
                        }
                        if (variantControl.errors?.['pattern']) {
                            emptyFields.push(label + ' must be in the correct format');
                        }
                        if (variantControl.errors?.['stockNotHigherThanLimit']) {
                            emptyFields.push('Stock should be higher than the Limit');
                        }
                    }
                }
            }
    
            const errorDataforProduct = {
                errorMessage: this.errorMessage,
                suberrorMessage: emptyFields.join(', ')
            };
        
            this.ProductError.emit(errorDataforProduct);
        }
    }
    
    async onVariantEditSubmit(){
        if(this.editVariantForm.valid){
            const editedVariant = {
                size: this.editVariantForm.get('size')?.value,
                price: this.editVariantForm.get('price')?.value,
                stock: this.editVariantForm.get('stock')?.value,
                stock_limit: this.editVariantForm.get('stock_limit')?.value,
                color: this.editVariantForm.get('color')?.value,
                color_title: this.editVariantForm.get('color_title')?.value,
            };
            
            const index = this.index;
            if (index !== undefined && index >= 0 && index < this.variantsList.length) {
                this.variantsList.at(index).patchValue(editedVariant);
            }
            const productSuccess = {
                head: 'Edit Variant',
                sub: 'Successfully edited variant'
            };
            
            this.ProductSuccess.emit(productSuccess);
            
            await this.asyncTask();
            this.location.back();
        }else{
            this.editVariantForm.markAllAsTouched();
            const emptyFields = [];
            for (const controlName in this.editVariantForm.controls) {
                if ( this.editVariantForm.controls.hasOwnProperty(controlName)) {
                    const productcontrol = this.editVariantForm.controls[controlName];
                    if (productcontrol.errors?.['required'] && productcontrol.invalid ) {
                        const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                        emptyFields.push(label);
                    }
                }
            }
            
            const errorDataforProduct = {
                errorMessage: this.errorMessage,
                suberrorMessage: emptyFields.join(', ')
            };

            this.ProductError.emit(errorDataforProduct);
        }
        
    }
    

    
    // onProductRestockSubmit(): void {
        
    //     if(this.restockProductForm.valid){
    //         const formData = this.restockProductForm.value;
    //         console.log(this.restockProductForm.value);
    //         this.ProductSuccess.emit(this.productSuccessMessage +this.restockProductForm.value.product_name);
    //         this.restockProductForm.reset();
            
    //         // let formData: any = new FormData();
    //         // formData.append('name', this.restockProductForm.get('product_name')?.value);
    //         // formData.append('stock', this.restockProductForm.get('product_quantity')?.value);
    //         // formData.append('stock-limit', this.restockProductForm.get('product_quantity_limit')?.value);

    //         // for(const value of formData.entries()){
    //         //     console.log(`${value[0]}, ${value[1]}`);
    //         // }
            
    //         // this.product_service.postProduct(formData).subscribe({
    //         //     next: (response: any) => { 
    //         //         console.log(response);
    //         //         this.ProductSuccess.emit("Product "+this.restockProductForm.value.product_name);
    //         //         this.restockProductForm.reset();
    //         //     },
    //         //     error: (error: HttpErrorResponse) => {
    //         //         return throwError(() => error)
    //         //     }
    //         // });
        
    //     }else{
    //         this.restockProductForm.markAllAsTouched();
    //         const emptyFields = [];
    //         for (const controlName in this.restockProductForm.controls) {
    //             if (this.restockProductForm.controls.hasOwnProperty(controlName) && this.restockProductForm.controls[controlName].errors?.['required']) {
    //                 const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
    //                 emptyFields.push(label);
    //             }
    //         }

    //         const errorData = {
    //             errorMessage: this.errorMessage,
    //             suberrorMessage: emptyFields.join(', ')
    //         };
    //         this.ProductError.emit(errorData);
    //     }
        
        
    // }
}
