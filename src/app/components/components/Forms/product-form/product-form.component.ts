import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, combineLatest, first, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';

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
    @ViewChild('dismiss') dismiss: ElementRef;

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
    
    imageList: FormArray = this.formBuilder.array([]);
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
	    private route: ActivatedRoute,
	    private cdr: ChangeDetectorRef
    ) 
    {
        //get variants
        this.imageList = this.product_service.getImageList()
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
	        images: this.imageList,

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
            variants: this.EditFormvariantsList,
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
            const sub_category_id = products.find(products => products.id === this.selectedRowData)?.sub_category_id || 'error';
            
            this.editProductForm.patchValue({
                name: name ? name : null,
                subcategory: sub_category_id ? sub_category_id: null,
                description: description ? description : null,
            });
    
        });
        
        
        const editVariantData = this.variantService.getVariantFromEditForm();

        if (editVariantData) {
            this.editVariantForm = editVariantData.form;
            this.index = editVariantData.index;
        }
        
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
        return this.editProductForm.pristine || Object.values(this.editProductForm.value).every(value => !value);
    }
    

    asyncTask(): Promise<void> {
        // Simulate an asynchronous task with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            }, 1500); 
        });
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
            this.product_service.addImageToList(fileControl);
        }
    }
    
    
    removeImage(index: number) {
        this.imageList.removeAt(index);
        this.product_service.removeImg(index);
    }
    
    extractFileName(url: string): string {
        const parts = url.split('/'); 
        return parts[parts.length - 1]; 
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
    
    //route
    navigateToProductManagement() {
        this.router.navigate(['/admin/product-management']);
    }
    
    navigateToProductAdd(mode: 'add' | 'edit') {
        const route = mode === 'add' ? ['/admin/product-management', 'product', 'add'] : ['/admin/product-management', 'product', 'edit'];
        this.router.navigate(route);
    }
    
    navigateToProductEdit(prod_id: any) {
        this.router.navigate(['/admin/product-management', 'product', 'edit', prod_id]);
    }
    
    async getParam(paramName: string): Promise<string | null> {
        return this.route.paramMap.pipe(first()).toPromise().then(params => params?.get(paramName) || null);
    }
    
    cancelAction(page: string){
        switch (page) {
            case 'add-prod-to-prod-management':
                this.navigateToProductManagement();
                this.addProductForm.reset();
                this.variantsList.clear();
            break;
            case 'add-var-to-add-prod':
                this.navigateToProductAdd('add');
                this.addVariantForm.reset();
            break;
            case 'edit-var-to-add-prod':
                this.navigateToProductAdd('edit');
                this.editVariantForm.reset();
            break;
            case 'edit-prod-to-prod-management':
                this.navigateToProductManagement();
                this.editProductForm.reset();
                this.editVariantForm.reset();
                this.EditedvariantsList.clear();
                this.AdditionvariantsList.clear();
                this.DeletedvariantsList.clear();
            break;
            case 'add-var-to-edit-prod':
                this.route.paramMap.subscribe(async (params) => {
                    const prod_id = params.get('id');
                    this.navigateToProductEdit(prod_id);
                    this.addVariantForm.reset();
                });
            break;
            case 'edit-var-to-edit-prod':
                this.route.paramMap.subscribe(async (params) => {
                    const prod_id = params.get('prod_id');
                    this.navigateToProductEdit(prod_id);
                    this.editVariantForm.reset();
                });
            break;
            default:
                this.navigateToProductManagement();
                break;
        }
    }
    
    async doneAction(page: string) {
        switch (page) {
            case 'add-prod-to-prod-management':
                this.navigateToProductManagement();
                break;
            case 'add-var-to-add-prod':
                this.navigateToProductAdd('add');
                break;
            case 'edit-var-to-add-prod':
                this.navigateToProductAdd('edit');
                break;
            case 'add-var-to-edit-prod':
                const prodId = await this.getParam('id');
                this.navigateToProductEdit(prodId);
                break;
            case 'edit-var-to-edit-prod':
                const editProdId = await this.getParam('prod_id');
                this.navigateToProductEdit(editProdId);
                break;
            default:
                this.navigateToProductManagement();
                break;
        }
    }
    
    async closeModal() {
        this.dismiss.nativeElement.click();
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
    
    async editAdditionalVariant(value: any, index: any): Promise<void>{
        
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
        this.router.navigate(['/admin/product-management', 'variant', 'edit/additional']);
    
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
    async removeVariants() {
        const index = this.index
        if (index >= 0 && index < this.variantsList.length) {
            this.variantsList.removeAt(index);
            this.EditedvariantsList.removeAt(index);
        }
        
        this.variantService.deletefromDatabaseVariant(this.selectedDeleteVariant?.variant_id, index)
        this.EditedvariantsList.removeAt(index)
        
        const productSuccess = {
            head: 'Delete Variant',
            sub: 'Successfully removed variant'
        };
        
        this.ProductSuccess.emit(productSuccess);
        
        await this.asyncTask();
        this.closeModal()
        
    }
    
    removeAdditionalVariants(){
        const index = this.index
        if (index >= 0 && index < this.AdditionvariantsList.length) {
            this.AdditionvariantsList.removeAt(index);
        }
    }
    
    //check for duplicate variant
    isDuplicateVariant(existingVariant: any, newVariant: any): boolean {
        return (
            existingVariant.size === newVariant.size &&
            existingVariant.stock === newVariant.stock &&
            existingVariant.stock_limit === newVariant.stock_limit &&
            existingVariant.color === newVariant.color &&
            existingVariant.color_title === newVariant.color_title
        );
    }

    //For submission
    submit(mode: string, form: FormData, id: string): Observable<any> {
        switch(mode){
            case 'edit-product' :
                return this.product_service.patchProduct(form);
            break;
            case 'add-variant':
                return this.variantService.postVariants(form);
            break;
            case 'edit-variant':
                return this.variantService.patchVariants(form);
            break;
            case 'delete-variant':
                return this.variantService.deleteVariants(id);
            break;
            default:
            throw new Error(`Invalid mode: ${mode}`);
        }

    }
    
    //submission response
    handleResponse(
        response: any,
        
    ): void {
        const productSuccess = {
            head: 'Edit Product',
            sub: response.message
        };
        
        this.ProductSuccess.emit(productSuccess);
    }
    
    handleError(error: HttpErrorResponse): Observable<never> {
        const errorMessage = 'Error Invalid Inputs'
        
        if (error.error?.data?.error) {
            const fieldErrors = error.error.data.error;
            const errorsArray = [];
            
            
            for (const field in fieldErrors) {
                if (fieldErrors.hasOwnProperty(field)) {
                    const messages = fieldErrors[field];
                    let errorMessage = messages;
                    if (Array.isArray(messages)) {
                        errorMessage = messages.join(' '); 
                }
                    errorsArray.push(errorMessage);
                }
            }
    
            const errorDataforProduct = {
                errorMessage: errorMessage,
                suberrorMessage: errorsArray,
            };
        
            this.ProductWarning.emit(errorDataforProduct);
            
        } else {
            const errorDataforProduct = {
                errorMessage: errorMessage,
                suberrorMessage: 'Please Try Another One',
            };
            this.ProductError.emit(errorDataforProduct);
        }
        return throwError(() => error);
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
                    this.imageList.clear();
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
        //FORMS
        let EditProducts: any = new FormData();
        let AdditionalVariants: any = new FormData();
        let EditedVariants: any = new FormData();
        let DeletedVariants: any = new FormData();
        
        const additionalvariantsList = this.editProductForm.get('additional_variants') as FormArray;
        const editedvariantsList = this.editProductForm.get('edited_variants') as FormArray;
        const deletedvariantsList = this.editProductForm.get('deleted_variants') as FormArray;
        
        this.route.paramMap.subscribe(async (params) => {
        
            const prod_id = params.get('id');
            
            //Edit product
            EditProducts.append('id', prod_id);
            EditProducts.append('name', this.editProductForm.get('name')?.value);
            EditProducts.append('category', this.editProductForm.get('subcategory')?.value);
            EditProducts.append('description', this.editProductForm.get('description')?.value);
            let anyObservableEmitted = false;
            
            //Additional variants
            for (let i = 0; i < additionalvariantsList.length; i++) {
                const variantFormGroup = additionalvariantsList.at(i) as FormGroup;
                const variant = variantFormGroup.value;
                // AdditionalVariants.append(`variants[${i}][product_id]`, variant.product_id);
                // AdditionalVariants.append(`variants[${i}][size]`, variant.size);
                // AdditionalVariants.append(`variants[${i}][quantity]`, variant.stock);
                // AdditionalVariants.append(`variants[${i}][limit]`, variant.stock_limit);
                // AdditionalVariants.append(`variants[${i}][price]`, variant.price);
                // AdditionalVariants.append(`variants[${i}][color]`, variant.color);
                // AdditionalVariants.append(`variants[${i}][color_title]`, variant.color_title);
                AdditionalVariants.append(`product_id`, variant.product_id);
                AdditionalVariants.append(`size`, variant.size);
                AdditionalVariants.append(`quantity`, variant.stock);
                AdditionalVariants.append(`limit`, variant.stock_limit);
                AdditionalVariants.append(`price`, variant.price.toFixed(2));
                AdditionalVariants.append(`color`, variant.color);
                AdditionalVariants.append(`color_title`, variant.color_title);
            }
            
            //Edited variants
            for (let i = 0; i < editedvariantsList.length; i++) {
                const variantFormGroup = editedvariantsList.at(i) as FormGroup;
                const variant = variantFormGroup.value;
                // EditedVariants.append(`variants[${i}][variant_id]`, variant.variant_id);
                // EditedVariants.append(`variants[${i}][product_id]`, variant.product_id);
                // EditedVariants.append(`variants[${i}][size]`, variant.size);
                // EditedVariants.append(`variants[${i}][quantity]`, variant.stock);
                // EditedVariants.append(`variants[${i}][limit]`, variant.stock_limit);
                // EditedVariants.append(`variants[${i}][price]`, variant.price);
                // EditedVariants.append(`variants[${i}][color]`, variant.color);
                // EditedVariants.append(`variants[${i}][color_title]`, variant.color_title);
                EditedVariants.append(`id`, variant.variant_id);
                EditedVariants.append(`size`, variant.size);
                EditedVariants.append(`quantity`, variant.stock);
                EditedVariants.append(`limit`, variant.stock_limit);
                EditedVariants.append(`price`, variant.price);
                EditedVariants.append(`color`, variant.color);
                EditedVariants.append(`color_title`, variant.color_title);
            }
            
            //Deleted variants
            for (let i = 0; i < deletedvariantsList.length; i++) {
                const variantFormGroup = deletedvariantsList.at(i) as FormGroup;
                const variant = variantFormGroup.value.toString();
                DeletedVariants.append(`id`, variant);
            }
            
            const observables = [];

            if (this.editProductForm.dirty) {
                observables.push(this.submit('edit-product', EditProducts, ''));
            }
        
            if (additionalvariantsList.length > 0) {
                observables.push(this.submit('add-variant', AdditionalVariants, ''));
            }
        
            if (editedvariantsList.length > 0) {
                observables.push(this.submit('edit-variant', EditedVariants, ''));
            }
        
            if (deletedvariantsList.length > 0) {
                observables.push(this.submit('delete-variant', DeletedVariants, DeletedVariants));
            }
        
            if (observables.length === 0) {
                const errorDataforProduct = {
                    errorMessage: 'Edit Product',
                    suberrorMessage: 'Nothing change',
                };
                this.ProductWarning.emit(errorDataforProduct);
                return;
            }
            
            //need to work
            forkJoin(observables).subscribe({
                next: async ([editProductResponse, addVariantResponse, editVariantResponse, deleteVariantResponse]) => {
                    console.log("Inside next callback");
                    console.log("editProductResponse:", editProductResponse);
                    console.log("addVariantResponse:", addVariantResponse);
                    console.log("editVariantResponse:", editVariantResponse);
                    console.log("deleteVariantResponse:", deleteVariantResponse);
        
                    this.cdr.detectChanges();
                    if (
                        editProductResponse 
                        && addVariantResponse 
                        && editVariantResponse 
                        && deleteVariantResponse
                    ) 
                    {
                        // Combine the responses if needed
                        const combinedResponse = {
                            message: `${editProductResponse.message} ${addVariantResponse.message} ${editVariantResponse.message} ${deleteVariantResponse.message}`
                        };
                        this.handleResponse(combinedResponse);
                        await this.asyncTask();
                        this.doneAction('');
                        
                    } else if (editProductResponse) {
                        this.handleResponse(editProductResponse);
                        await this.asyncTask();
                        this.doneAction('');

                    } else if (addVariantResponse) {
                        this.handleResponse(addVariantResponse);
                        await this.asyncTask();
                        this.doneAction('');
                        
                    } else if (editVariantResponse) {
                        this.handleResponse(editVariantResponse);
                        await this.asyncTask();
                        this.doneAction('');
                        
                    } else if (deleteVariantResponse) {
                        this.handleResponse(deleteVariantResponse);
                        await this.asyncTask();
                        this.doneAction('');
                        
                    }else{
                        console.log('nothing change')
                    }
                    


                },
                error: (error: HttpErrorResponse) => {
                    this.handleError(error);
                    console.error("Error:", error);   
                }
            });

            
        });
        
    }
    
    onProductDeleteSubmit(): void {
        this.product_service.deleteProduct(this.selectedRowData.id).subscribe({
            next: async (response: any) => { 
                const productSuccess = {
                    head: 'Delete Product',
                    sub: response.message
                };
                this.RefreshTable.emit();
                this.ProductSuccess.emit(productSuccess);
                
                await this.asyncTask();
                this.closeModal()
            },
            error: (error: HttpErrorResponse) => {
                const errorData = this.errorService.handleError(error);
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
            
                const newVariantFormValue = newVariantFormGroup.value;
                if (
                    this.variantsList.controls.some((control) =>
                        this.isDuplicateVariant(control.value, newVariantFormValue)
                    ) 
                ) {
                    const errorDataforProduct = {
                        errorMessage: 'Add Another Variant',
                        suberrorMessage: 'The data already exists',
                    };
                    this.ProductWarning.emit(errorDataforProduct);
                }
                else{
                    this.variantService.addVariantToVariantsList(newVariantFormGroup);
                    this.addVariantForm.reset();
                    this.addVariantForm.markAsPristine();
                    this.done = true
                    this.cancel = false
                    
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
    }
    
    async onadditionalProductVariants(): Promise<void> {
        this.route.paramMap.subscribe(async (params) => {

            const id = params.get('id');
            
            if (!this.addVariantForm.valid) {
                this.addVariantForm.markAllAsTouched();
                const emptyFields = [];
    
                for (const controlName in this.addVariantForm.controls) {
                    if (this.addVariantForm.controls.hasOwnProperty(controlName)) {
                        const variantControl = this.addVariantForm.controls[controlName];
                        if (variantControl.invalid) {
                            const label =
                                document.querySelector(`label[for="${controlName}"]`)?.textContent ||
                                controlName;
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
                    suberrorMessage: emptyFields.join(', '),
                };
    
                this.ProductError.emit(errorDataforProduct);
                return;
            }
    
            const newVariantFormValue = this.addVariantForm.value;
    
            if (
                this.EditFormvariantsList.controls.some((control) =>
                    this.isDuplicateVariant(control.value, newVariantFormValue)
                ) ||
                this.AdditionvariantsList.controls.some((control) =>
                    this.isDuplicateVariant(control.value, newVariantFormValue)
                )
            ) {
                const errorDataforProduct = {
                    errorMessage: 'Add Another Variant',
                    suberrorMessage: 'The data already exists',
                };
                this.ProductWarning.emit(errorDataforProduct);
            } else {
                // Variant doesn't exist, add it and emit success message
                const newVariantFormGroup = this.formBuilder.group({
                    product_id: [id],
                    size: [newVariantFormValue.size, Validators.required],
                    stock: [newVariantFormValue.stock, Validators.required],
                    stock_limit: [newVariantFormValue.stock_limit, Validators.required],
                    price: [newVariantFormValue.price, Validators.required],
                    color: [newVariantFormValue.color, [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]],
                    color_title: [newVariantFormValue.color_title],
                });
                
                console.log(newVariantFormGroup)
                console.log(newVariantFormGroup, this.EditFormvariantsList)
                this.variantService.addtoDatabaseVariant(newVariantFormGroup);
                this.addVariantForm.reset();
                this.addVariantForm.markAsPristine();
                this.done = true;
                this.cancel = false;
    
                const successVariants = {
                    head: 'Add Variant',
                    sub: 'Successfully added variants',
                };
                this.ProductSuccess.emit(successVariants);
            }
            
        
            
        });
    }
    
    async onVariantEditSubmit(){
        this.route.paramMap.subscribe((params) => {

            const id = params.get('id');

            if(this.editVariantForm.valid){
                const editedVariant = this.formBuilder.group({
                    variant_id: id,
                    size: this.editVariantForm.get('size')?.value,
                    price: this.editVariantForm.get('price')?.value,
                    stock: this.editVariantForm.get('stock')?.value,
                    stock_limit: this.editVariantForm.get('stock_limit')?.value,
                    color: this.editVariantForm.get('color')?.value,
                    color_title: this.editVariantForm.get('color_title')?.value,
                });
                
                const newVariantFormValue = editedVariant.value;
                
                if (
                    this.variantsList.controls.some((control) =>
                        this.isDuplicateVariant(control.value, newVariantFormValue)
                    ) 
                ) {
                    const errorDataforProduct = {
                        errorMessage: 'Add Another Variant',
                        suberrorMessage: 'The data already exists',
                    };
                    this.ProductWarning.emit(errorDataforProduct);
                }else{
                    const index = this.index;
                    if (index !== undefined && index >= 0 && index < this.variantsList.length) {
                        this.variantsList.at(index).patchValue(editedVariant);
                        
                    }
                    const productSuccess = {
                        head: 'Edit Variant',
                        sub: 'Successfully edited variant'
                    };
                    
                    this.ProductSuccess.emit(productSuccess);
                    this.doneAction('edit-var-to-add-prod');
                }
                
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
    
    async onAdditionalVariantEditSubmit(){
        this.route.paramMap.subscribe((params) => {

            const id = params.get('id');

            if(this.editVariantForm.valid){
                const editedVariant = this.formBuilder.group({
                    variant_id: id,
                    size: this.editVariantForm.get('size')?.value,
                    price: this.editVariantForm.get('price')?.value,
                    stock: this.editVariantForm.get('stock')?.value,
                    stock_limit: this.editVariantForm.get('stock_limit')?.value,
                    color: this.editVariantForm.get('color')?.value,
                    color_title: this.editVariantForm.get('color_title')?.value,
                });
                
                const newVariantFormValue = editedVariant.value;
                
                if (
                    this.EditFormvariantsList.controls.some((control) =>
                        this.isDuplicateVariant(control.value, newVariantFormValue)
                    ) ||
                    this.AdditionvariantsList.controls.some((control) =>
                        this.isDuplicateVariant(control.value, newVariantFormValue)
                    ) 
                ) {
                    const errorDataforProduct = {
                        errorMessage: 'Add Another Variant',
                        suberrorMessage: 'The data already exists',
                    };
                    this.ProductWarning.emit(errorDataforProduct);
                } else{
                    const index = this.index;
                    if (index !== undefined && index >= 0 && index < this.AdditionvariantsList.length) {
                        this.AdditionvariantsList.at(index).patchValue(editedVariant);
                        
                    }
                    const productSuccess = {
                        head: 'Edit Variant',
                        sub: 'Successfully edited variant'
                    };
                    
                    this.doneAction('edit-var-to-edit-prod');
                    this.ProductSuccess.emit(productSuccess);
                }
                
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
        
            if (
                this.EditFormvariantsList.controls.some((control) =>
                    this.isDuplicateVariant(control.value, newVariantFormValue)
                ) ||
                this.AdditionvariantsList.controls.some((control) =>
                    this.isDuplicateVariant(control.value, newVariantFormValue)
                ) 
            ) {
                const errorDataforProduct = {
                    errorMessage: 'Add Another Variant',
                    suberrorMessage: 'The data already exists',
                };
                this.ProductWarning.emit(errorDataforProduct);
            } else {
                const index = this.index;
                
                const editedIndex = this.EditedvariantsList.controls.findIndex(control =>
                    control.value.variant_id === editedVariant.value.variant_id
                );
                
                if (editedIndex !== -1) {
                    this.EditedvariantsList.removeAt(editedIndex);
                    this.variantService.editfromDatabaseVariant(editedVariant, index);

                } else {
                    this.variantService.editfromDatabaseVariant(editedVariant, index);
                }
                
                this.doneAction('edit-var-to-edit-prod');
                const productSuccess = {
                    head: 'Edit Variant',
                    sub: 'Successfully edited variant'
                };
                
                this.ProductSuccess.emit(productSuccess);
                
                
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
