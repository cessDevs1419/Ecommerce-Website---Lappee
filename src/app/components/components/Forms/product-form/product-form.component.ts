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
import * as bootstrap from 'bootstrap';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
    
    @ViewChild('priceInput', { static: false }) priceInputRef!: ElementRef<HTMLInputElement>;
    @ViewChild('openModalBtn') openModalBtn!: ElementRef;
    @ViewChild('modalRef') modalRef!: ElementRef;
    
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
    //Database Variant place here if there's edit place here too also additional variant
    EditFormvariantsList: FormArray = this.formBuilder.array([]); 
    AdditionvariantsList: FormArray = this.formBuilder.array([]); 
    EditedvariantsList: FormArray = this.formBuilder.array([]); 
    DeletedvariantsList: FormArray = this.formBuilder.array([]); 
    placeVariantTolist: any[] = [];

    variantId: FormArray = this.formBuilder.array([]);
    selectedDeleteVariant: Variant | undefined;
    
    selectedSubCategory: null;
    hideselectedsub: boolean = true;
	showForm: boolean = false;
    selectedVariants: any[] = [];
    selectedSubCategoryId: string;
    
    index: number;
    variant_id: string;
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
	    private location: Location,
	    private route: ActivatedRoute
    ) 
    {
        //get variants
        this.variantsList = this.variantService.getVariants()
        this.EditFormvariantsList = this.variantService.getDatabaseVariant();
        this.AdditionvariantsList = this.variantService.getAdditionVariant();
        this.EditedvariantsList = this.variantService.getEditedVariant();
        this.DeletedvariantsList = this.variantService.getDeletedVariant();
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
            additional_variants: this.AdditionvariantsList,
            edited_variants: this.EditedvariantsList,
            deleted_variants: this.DeletedvariantsList
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
        // const sameProductVariants = this.AdditionvariantsList.controls.filter(
        //     control => control.get('product_id')?.value === this.id
        // );
        
        this.route.paramMap.subscribe((params) => {
			const page = params.get('page');
		    const action = params.get('action');
		    const id = params.get('id');
		    
		    const data = this.variantService.getDatabaseVariant();
		    
            this.variantService.setDatabaseVariant(id);
            this.variantService.loadVariants();
            this.EditFormvariantsList = this.variantService.getDatabaseVariant();
        });
        

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
        this.route.paramMap.subscribe((params) => {
		    const id = params.get('id');
		    
            switch(value){
                case 'edit' : 
                    this.showForm = true;
                    this.router.navigate(['/admin/product-management','variant','additional/to',id]);
                break
                
                default :
                    this.showForm = true;
                    this.router.navigate(['/admin/product-management','variant','add']);
                break
            }
        });
    }
    

    

    
    cancelthis() {
        this.route.paramMap.subscribe(async (params) => {
            const prod_id = params.get('id');
            
            this.router.navigate(['/admin/product-management', 'product', 'edit', prod_id]);
            this.EditFormvariantsList.clear();
            console.log(prod_id)
        });
    }
    
    canceledit() {
        this.route.paramMap.subscribe(async (params) => {
            const prod_id = params.get('prod_id');
            
            this.router.navigate(['/admin/product-management', 'product', 'edit', prod_id]);
            this.EditFormvariantsList.clear();
            console.log(prod_id)
        });
    }
    
    toAddPage(): void {
        //this.router.navigate(['/admin/product-management', 'product', 'add']);
        this.location.back()
    }
    
    toProductPage(): void {
        this.router.navigate(['/admin/product-management']);
        this.addProductForm.reset();
        this.editProductForm.reset();
        this.variantsList.clear();
        this.EditFormvariantsList.clear();
    }
    
    toEditPage(): void {
        this.router.navigate(['/admin/product-management', 'product', 'edit']);
    }

    
    //Place Variant to EditForm
    async editVariant(value: any, index: any): Promise<void>{
        
        this.index = index
        
        this.editVariantForm.patchValue({
            size: value.size,
            stock: value.stock,
            stock_limit: value.stock_limit,
            price: value.price,
            color: value.color,
            color_title: value.color_title,
        });
        
        console.log(value)
        this.variantService.setVariantToEditForm(this.editVariantForm, index);
        
        await this.asyncTask();
        this.router.navigate(['/admin/product-management', 'variant', 'edit']);
    
    }

    async editDatabaseVariant(value: any, index: any): Promise<void>{
        
        this.index = index
        
        this.editVariantForm.patchValue({
            size: value.size,
            stock: value.stock,
            stock_limit: value.stock_limit,
            price: value.price,
            color: value.color,
            color_title: value.color_title,
        });
        
        this.variantService.setVariantToEditForm(this.editVariantForm, index);
        
        await this.asyncTask();
        this.router.navigate(['/admin/product-management', 'variant', 'edit/', value.variant_id, 'of', value.product_id]);
    
    }
    
    //Delete Variant
    selectVariant(variant: Variant , index: number) {
        this.selectedDeleteVariant = variant
        this.index = index
        this.formDeleteVariant = true
        
    }
    
    //remove variants from array this works only for adding new variant
    removeVariants(): void {
        const index = this.index
        if (index >= 0 && index < this.variantsList.length) {
            this.variantsList.removeAt(index);
        }
        
        this.variantService.deletefromDatabaseVariant(this.selectedDeleteVariant?.variant_id, index)
        this.EditedvariantsList.removeAt(index)
        
        const productSuccess = {
            head: 'Delete Variant',
            sub: 'Successfully removed variant'
        };
        
        this.ProductSuccess.emit(productSuccess);
        
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
        
        //edit product
        let editProducts: any = new FormData();
        editProducts.append('id', this.selectedRowData);
        editProducts.append('name', this.editProductForm.get('name')?.value);
        editProducts.append('category', this.editProductForm.get('subcategory')?.value);
        editProducts.append('description', this.editProductForm.get('description')?.value);
        

        //Additional variants
        let AdditionalVariants: any = new FormData();
        const additionalvariantsList = this.editProductForm.get('additional_variants') as FormArray;
        for (let i = 0; i < additionalvariantsList.length; i++) {
            const variantFormGroup = additionalvariantsList.at(i) as FormGroup;
            const variant = variantFormGroup.value;
            AdditionalVariants.append(`variants[${i}][product_id]`, variant.product_id);
            AdditionalVariants.append(`variants[${i}][size]`, variant.size);
            AdditionalVariants.append(`variants[${i}][quantity]`, variant.stock);
            AdditionalVariants.append(`variants[${i}][limit]`, variant.stock_limit);
            AdditionalVariants.append(`variants[${i}][price]`, variant.price);
            AdditionalVariants.append(`variants[${i}][color]`, variant.color);
            AdditionalVariants.append(`variants[${i}][color_title]`, variant.color_title);
        }
        
        //Edited variants
        let EditedVariants: any = new FormData();
        const editedvariantsList = this.editProductForm.get('edited_variants') as FormArray;
        for (let i = 0; i < editedvariantsList.length; i++) {
            const variantFormGroup = editedvariantsList.at(i) as FormGroup;
            const variant = variantFormGroup.value;
            EditedVariants.append(`variants[${i}][variant_id]`, variant.variant_id);
            EditedVariants.append(`variants[${i}][product_id]`, variant.product_id);
            EditedVariants.append(`variants[${i}][size]`, variant.size);
            EditedVariants.append(`variants[${i}][quantity]`, variant.stock);
            EditedVariants.append(`variants[${i}][limit]`, variant.stock_limit);
            EditedVariants.append(`variants[${i}][price]`, variant.price);
            EditedVariants.append(`variants[${i}][color]`, variant.color);
            EditedVariants.append(`variants[${i}][color_title]`, variant.color_title);
        }
        
        //deleted variants
        let DeletedVariants: any = new FormData();
        const deletedvariantsList = this.editProductForm.get('deleted_variants') as FormArray;
        for (let i = 0; i < deletedvariantsList.length; i++) {
            const variantFormGroup = deletedvariantsList.at(i) as FormGroup;
            const variant = variantFormGroup.value;
            DeletedVariants.append(`variants[${i}][variant_id]`, variant);
        }
        
        //output
        console.log('edit products')
        for (const value of editProducts.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        }
        console.log('__add another variants__')
        for (const value of AdditionalVariants.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        }
        console.log('__edited variants__')
        for (const value of EditedVariants.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        }
        console.log('__deleted variants__')
        for (const value of DeletedVariants.entries()) {
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
        
        // await this.asyncTask();
        // this.router.navigate(['/admin/product-management']);
        
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
    
    async onadditionalProductVariants(): Promise<void> {
        this.route.paramMap.subscribe(async (params) => {

            const id = params.get('id');
            
            if (this.addVariantForm.valid) {
            
                const newVariantFormGroup = this.formBuilder.group({
                    product_id: [id],
                    size: [this.addVariantForm.get('size')?.value, Validators.required],
                    stock: [this.addVariantForm.get('stock')?.value, Validators.required],
                    stock_limit: [this.addVariantForm.get('stock_limit')?.value, Validators.required],
                    price: [this.addVariantForm.get('price')?.value, Validators.required],
                    color: [this.addVariantForm.get('color')?.value, [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]],
                    color_title: [this.addVariantForm.get('color_title')?.value],
                });
            
                const newVariantFormValue = newVariantFormGroup.value;
        
                    if (this.EditFormvariantsList.controls.some(control => {
                        const controlValue = control.value;
                        return (
                            controlValue.size === newVariantFormValue.size &&
                            controlValue.stock === newVariantFormValue.stock &&
                            controlValue.stock_limit === newVariantFormValue.stock_limit &&
                            controlValue.price === newVariantFormValue.price &&
                            controlValue.color === newVariantFormValue.color &&
                            controlValue.color_title === newVariantFormValue.color_title
                        );
                    })) {
                        // Variant already exists, emit a warning message
                    const errorDataforProduct = {
                        errorMessage: 'Add Another Variant',
                        suberrorMessage: 'The data already exists'
                    };
                    this.ProductWarning.emit(errorDataforProduct);
                
                
                } else {
                    // Variant doesn't exist, add it and emit success message
                    this.variantService.addtoDatabaseVariant(newVariantFormGroup);
                    this.addVariantForm.reset();
                    this.addVariantForm.markAsPristine();
                    console.log(this.EditFormvariantsList);
                    const successVariants = {
                        head: 'Add Variant',
                        sub: 'Successfully added variants'
                    };
                    this.ProductSuccess.emit(successVariants);
                }
            
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
            
            await this.asyncTask();
            this.router.navigate(['/admin/product-management', 'product', 'edit', id]);
            
        });
    }
    
    async onVariantEditSubmit(){
        this.route.paramMap.subscribe((params) => {

            const id = params.get('id');

            if(this.editVariantForm.valid){
                const editedVariant = {
                    variant_id: id,
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
                this.toAddPage()

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
        });
        await this.asyncTask();
    }
    
    async onDatabaseVariantEditSubmit(){

        this.route.paramMap.subscribe(async (params) => {

            const var_id = params.get('var_id');
            const prod_id = params.get('prod_id');
            
            const editedVariant = this.formBuilder.group({
                variant_id: var_id,
                product_id: prod_id,
                size: this.editVariantForm.get('size')?.value,
                price: this.editVariantForm.get('price')?.value,
                stock: this.editVariantForm.get('stock')?.value,
                stock_limit: this.editVariantForm.get('stock_limit')?.value,
                color: this.editVariantForm.get('color')?.value,
                color_title: this.editVariantForm.get('color_title')?.value,
            });
        
            const newVariantFormValue = editedVariant.value;
        
            if (this.EditFormvariantsList.controls.some(control => {
                const controlValue = control.value;
                return (
                    controlValue.size === newVariantFormValue.size &&
                    controlValue.stock === newVariantFormValue.stock &&
                    controlValue.stock_limit === newVariantFormValue.stock_limit &&
                    controlValue.price === newVariantFormValue.price &&
                    controlValue.color === newVariantFormValue.color &&
                    controlValue.color_title === newVariantFormValue.color_title
                );
                })) 
            {
                // Variant already exists, emit a warning message
                const errorDataforProduct = {
                    errorMessage: 'Add Another Variant',
                    suberrorMessage: 'The data already exists'
                };
                this.ProductWarning.emit(errorDataforProduct);
            } else {
                const index = this.index;
                this.variantService.editfromDatabaseVariant(editedVariant, index);
                
                const productSuccess = {
                    head: 'Edit Variant',
                    sub: 'Successfully edited variant'
                };
                
                this.ProductSuccess.emit(productSuccess);
                
                await this.asyncTask();
                this.router.navigate(['/admin/product-management', 'product', 'edit', prod_id]);
            }
            
        });
        
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

