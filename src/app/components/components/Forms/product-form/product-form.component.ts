import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, combineLatest, filter, first, forkJoin, map, of, startWith, switchMap, tap, throwError } from 'rxjs';

import { AdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { formatAdminCategories, formatAdminSubcategories, formatAttributes, formatProducts} from 'src/app/utilities/response-utils';
import { ProductsService } from 'src/app/services/products/products.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlingService } from 'src/app/services/errors/error-handling-service.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FormsDataService} from 'src/app/services/forms/forms-data.service';
import { VariantsService } from 'src/app/services/variants/variants.service';
import { Product } from 'src/assets/models/products';
import { Location } from '@angular/common';
import { Variant } from 'src/assets/models/products';
import * as bootstrap from 'bootstrap';
import { AttributesService } from 'src/app/services/attributes/attributes.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
    
    //theme
    formColor: string = "dark-form-bg"
    formTextColor: string = "dark-theme-text-color"
    formInputColor: string = "text-white"
    formBorderColor: string = "dark-theme-border-color"

    private refreshData$ = new Subject<void>();
	public searchString: string;
	
    @ViewChild('priceInput', { static: false }) priceInputRef!: ElementRef<HTMLInputElement>;
    @ViewChild('openModalBtn') openModalBtn!: ElementRef;
    @ViewChild('modalRef') modalRef!: ElementRef;
    @ViewChild('dismiss1') dismissModal1: ElementRef;
    
    @Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
    @Output() ProductWarning: EventEmitter<any> = new EventEmitter();
    @Output() CloseModal: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();
    @Output() DeleteVariant: EventEmitter<any> = new EventEmitter<any>();

    @Input() selectedRowData: any;
    @Input() selectedRowDataForDelete: any;
    @Input() formAddProduct!: boolean;
    @Input() formEditProduct!: boolean;
    @Input() formSelectAttribute!: boolean;
    @Input() formDeleteProduct!: boolean;
    
	productSuccessMessage = 'Product: ';
	errorMessage = 'Please fill in all the required fields.';
	
    //form group
    addProductForm: FormGroup;
    editProductForm: FormGroup;
    addVariantForm: FormGroup;
    addAttributeForm: FormGroup;
    editVariantForm: FormGroup;
	deleteProductForm: FormGroup;
    selectedAttributeForm: FormGroup;
    
    categories!: Observable<AdminCategory[]>;
	attributes!: Observable<AdminCategory[]>;
    products!: Observable<Product[]>;
    
    variantsList: FormArray = this.formBuilder.array([]);
    imageList: FormArray = this.formBuilder.array([]);
    attributesListName: FormArray = this.formBuilder.array([]);
    attributesListId: FormArray = this.formBuilder.array([]);
    
    index: number;
    Additionalindex: number;
    variant_id: string;
    done: boolean;
    cancel: boolean = true; 
    selectedImages: string[] = [];
    isFormContainerVisible = false;
    hideVariantValidationContainer: boolean = true;
    showVariantFormContainer: boolean = false;
    fileUrlMap: Map<File, string> = new Map();
    
    constructor(
	    private http: HttpClient,
	    private category_service: CategoriesService,
        private product_service: ProductsService,
        private attribute_service: AttributesService,
        private errorService: ErrorHandlingService,
	    private formBuilder: FormBuilder,
	    private router: Router,
	    private formDataService: FormsDataService,
	    private variantService: VariantsService,
	    private attributeService: AttributesService,
	    private location: Location,
	    private route: ActivatedRoute,

    ) 
    {
        this.attributesListName = this.attribute_service.getSelectedAttributesName()
        this.attributesListId = this.attribute_service.getSelectedAttributesID()
        this.imageList = this.product_service.getImageList()
        this.variantsList = this.variantService.getVariants()
        
        this.selectedAttributeForm = this.formBuilder.group({
            selectedCheckboxesId: this.formBuilder.array([]),
            selectedCheckboxesName: this.formBuilder.array([])
        });
        
        this.addProductForm = this.formBuilder.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            description: ['', Validators.required],
            images: this.imageList,
            variants: this.formBuilder.array([]), 
        });
        
        this.addVariantForm = this.formBuilder.group({
            name: ['', Validators.required],
            quantity: ['', Validators.required],
            price: ['', Validators.required],
            attributes: this.formBuilder.array([]), 
        });
        
        this.addAttributeForm = this.formBuilder.group({
            attributeId: this.formBuilder.control(''), 
            attributeName: this.formBuilder.control(''),
        });
    }
    
    ngOnInit(): void{
		this.categories = this.category_service.getAdminCategories().pipe(map((Response: any) => formatAdminCategories(Response)));
        
        this.products = this.product_service.getAdminProducts().pipe(map((Response: any) => formatProducts(Response)));

        this.attributes = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.attribute_service.getAttribute()),
            map((Response: any) => formatAttributes(Response))
        );
	}

    refreshTableData(): void {
        this.refreshData$.next();
    }
    
    asyncTask(): Promise<void> {
        // Simulate an asynchronous task with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            }, 1500); 
        });
    }
    
    cancelAction(){
        this.location.back()
    }
    
    selectVariant(variant: Variant , index: number) {
        this.index = index
        console.log(variant, index)
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
    getFileKeys(): File[] {
        return Array.from(this.fileUrlMap.keys());
    }
    convertFileToUrl(file: File) {
        const reader = new FileReader();

        reader.onload = (event) => {
            this.fileUrlMap.set(file, event.target?.result as string);
        };

        reader.readAsDataURL(file);
    }
    handleFileInput(event: any) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileControl = this.formBuilder.control(file);
            this.product_service.addImageToList(fileControl);
            this.convertFileToUrl(file);
        }
    }
    removeImage(index: number) {
        this.product_service.removeImg(index);
        const files = this.getFileKeys();
        if (index >= 0 && index < files.length) {
            const fileToRemove = files[index];
            this.fileUrlMap.delete(fileToRemove);
        }
    }
    extractFileName(url: string): string {
        const parts = url.split('/'); 
        return parts[parts.length - 1]; 
    }
    
//Get and remove attributes
    get selectedCheckboxesId(): FormArray {
        return this.selectedAttributeForm.get('selectedCheckboxesId') as FormArray;
    }
    get selectedCheckboxesName(): FormArray {
        return this.selectedAttributeForm.get('selectedCheckboxesName') as FormArray;
    }
    isSelected(value: string): boolean {
        const selectedCheckboxesIdArray = this.attributesListId
        return selectedCheckboxesIdArray.value.includes(value);
    }
    toggleAttribute(id: string, name: string) {
        const selectedCheckboxesIdArray = this.selectedAttributeForm.get('selectedCheckboxesId') as FormArray;
        const selectedCheckboxesNameArray = this.selectedAttributeForm.get('selectedCheckboxesName') as FormArray;
    
        // Check if the id is already present in the selectedCheckboxesId array
        const idIndex = selectedCheckboxesIdArray.value.indexOf(id);
    
        if (idIndex === -1) {
          // If id is not present, add both id and name to their respective arrays
            selectedCheckboxesIdArray.push(this.formBuilder.control(id));
            selectedCheckboxesNameArray.push(this.formBuilder.control(name));
            this.attribute_service.postSelectedAttribute(this.formBuilder.control(id), this.formBuilder.control(name))
        } else {
          // If id is already present, remove it from both arrays (toggle off)
            selectedCheckboxesIdArray.removeAt(idIndex);
            selectedCheckboxesNameArray.removeAt(idIndex);
            this.attribute_service.removeSelectedAttribute(idIndex)
        }

    }
    removeAttribute(index: number){
        this.attribute_service.removeSelectedAttribute(index)
    }
    removeAllAttribute() {
        const selectedCheckboxesIdArray = this.selectedAttributeForm.get('selectedCheckboxesId') as FormArray;
        const selectedCheckboxesNameArray = this.selectedAttributeForm.get('selectedCheckboxesName') as FormArray;
    
        // Clear both FormArrays
        selectedCheckboxesIdArray.clear();
        selectedCheckboxesNameArray.clear();
    
        // You can also reset the form if needed
        this.selectedAttributeForm.reset();
        this.attribute_service.removeAllSelectedAttribute()
        console.log(this.selectedAttributeForm.value);
    }
    onSave(){
    
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

//check for duplicate variant
    isDuplicateVariant(existingVariant: any, newVariant: any): boolean {
        return (
            existingVariant.name === newVariant.name &&
            existingVariant.quantity === newVariant.quantity &&
            existingVariant.price === newVariant.price
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
//showVarriant Forms
    async showVariantForms(): Promise<void>{
        this.hideVariantValidationContainer = false;
        this.showVariantFormContainer = true;
        
        await this.onaddProductVariants()
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
        this.route.paramMap.subscribe(async (params) => {
            this.router.navigate(['/admin/product-management', 'variant', 'edit']);
        });
    
    }

//submit products
    async onProductAddSubmit(): Promise<void> {

        let formData: any = new FormData();
        formData.append('name', this.addProductForm.get('name')?.value);
        formData.append('category', this.addProductForm.get('category')?.value);
        formData.append('description', this.addProductForm.get('description')?.value);
        formData.append('variants', this.addProductForm.get('variantName')?.value);
        
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
        // const variantsList = this.addProductForm.get('variants') as FormArray;
        // for (let i = 0; i < variantsList.length; i++) {
        //     const variantFormGroup = variantsList.at(i) as FormGroup;
        //     const variant = variantFormGroup.value;
        //     formData.append(`variants[${i}][name]`, variant.size);
        //     formData.append(`variants[${i}][quantity]`, variant.stock);
        //     formData.append(`variants[${i}][price]`, variant.price.toFixed(2));
        // }
        
        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        }
        

        
        // if(this.addProductForm.valid){
        
        //     this.product_service.postProduct(formData).subscribe({
        //         next: (response: any) => { 
                    
        //             const productSuccess = {
        //                 head: 'Add Product',
        //                 sub: response.message
        //             };
                
        //             this.RefreshTable.emit();
        //             this.ProductSuccess.emit(productSuccess);
        //             this.addProductForm.reset();
        //             this.variantsList.clear();
        //             this.imageList.clear();
        //             this.done = true;
        //             this.cancel = false;
        //         },
        //         error: (error: HttpErrorResponse) => {
        //             if (error.error?.data?.error) {
        //                 const fieldErrors = error.error.data.error;
        //                 const errorsArray = [];
                    
        //                 for (const field in fieldErrors) {
        //                     if (fieldErrors.hasOwnProperty(field)) {
        //                         const messages = fieldErrors[field];
        //                         let errorMessage = messages;
        //                         if (Array.isArray(messages)) {
        //                             errorMessage = messages.join(' '); // Concatenate error messages into a single string
        //                         }
        //                         errorsArray.push(errorMessage);
        //                     }
        //                 }
                    
        //                 const errorDataforProduct = {
        //                     errorMessage: 'Error Invalid Inputs',
        //                     suberrorMessage: errorsArray,
        //                 };
                    
        //                 this.ProductWarning.emit(errorDataforProduct);
        //             } else {
                    
        //                 const errorDataforProduct = {
        //                     errorMessage: 'Error Invalid Inputs',
        //                     suberrorMessage: 'Please Try Another One',
        //                 };
        //                 this.ProductError.emit(errorDataforProduct);
        //             }
        //             return throwError(() => error);
                    
        //         }
        //     });

        // } else{

        //     this.addProductForm.markAllAsTouched();
        //     const emptyFields = [];
        //     for (const controlName in this.addProductForm.controls) {
        //         if ( this.addProductForm.controls.hasOwnProperty(controlName)) {
        //             const productcontrol = this.addProductForm.controls[controlName];
        //             if (productcontrol.errors?.['required'] && productcontrol.invalid ) {
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
        

    
    }

//submit variants
    async onaddProductVariants(): Promise<void> {
        // if (this.addVariantForm.valid) {
        //     const newVariantFormGroup = this.formBuilder.group({
        //         name: [this.addVariantForm.get('name')?.value, Validators.required],
        //         quantity: [this.addVariantForm.get('quantity')?.value, Validators.required],
        //         price: [this.addVariantForm.get('price')?.value, Validators.required]
        //     });
                
        //         console.log(this.addVariantForm.value)
        //         const newVariantFormValue = newVariantFormGroup.value;
        //         if (
        //             this.variantsList.controls.some((control) =>
        //                 this.isDuplicateVariant(control.value, newVariantFormValue)
        //             ) 
        //         ) {
        //             const errorDataforProduct = {
        //                 errorMessage: 'Add Another Variant',
        //                 suberrorMessage: 'The data already exists',
        //             };
        //             this.ProductWarning.emit(errorDataforProduct);
        //         }
        //         else{
        //             this.variantService.addVariantToVariantsList(newVariantFormGroup);
        //             this.addVariantForm.reset();
        //             this.addVariantForm.markAsPristine();
        //             this.done = true
        //             this.cancel = false
                    
                    
        //             const successVariants = {
        //                 head: 'Add Variant',
        //                 sub: 'Successfully added variants'
        //             };
        
        //             this.ProductSuccess.emit(successVariants);
        //         }

            
        // } else {
        //     this.addVariantForm.markAllAsTouched();
        //     const emptyFields = [];
            
        //         for (const controlName in this.addVariantForm.controls) {
        //             if (this.addVariantForm.controls.hasOwnProperty(controlName)) {
        //                 const variantControl = this.addVariantForm.controls[controlName];
        //                 if (variantControl.invalid) {
        //                     const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
        //                     if (variantControl.errors?.['required']) {
        //                         emptyFields.push(label + ' is required');
        //                     }
        //                     if (variantControl.errors?.['pattern']) {
        //                         emptyFields.push(label + ' must be in the correct format');
        //                     }
        //                     if (variantControl.errors?.['stockNotHigherThanLimit']) {
        //                         emptyFields.push('Stock should be higher than the Limit');
        //                     }
        //                 }
        //             }
        //         }
            
        //     const errorDataforProduct = {
        //         errorMessage: this.errorMessage,
        //         suberrorMessage: emptyFields.join(', ')
        //     };
        
        //     this.ProductError.emit(errorDataforProduct);
        // }
    }
    
    
}
