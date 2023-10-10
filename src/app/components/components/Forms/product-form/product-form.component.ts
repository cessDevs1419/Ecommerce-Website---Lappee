import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, TemplateRef, ChangeDetectorRef, SimpleChanges } from '@angular/core';
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
import { Attributes } from 'src/assets/models/attributes';

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
    private isFormSave = false
	
	@ViewChild('attributeIdInput') attributeIdInput: ElementRef;
    @ViewChild('priceInput', { static: false }) priceInputRef!: ElementRef<HTMLInputElement>;
    @ViewChild('openModalBtn') openModalBtn!: ElementRef;
    @ViewChild('modalRef') modalRef!: ElementRef;
    @ViewChild('dismiss1') dismissModal1: ElementRef;
    
    @Output() Index: EventEmitter<any> = new EventEmitter();
    @Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
    @Output() ProductWarning: EventEmitter<any> = new EventEmitter();
    @Output() CloseModal: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();
    @Output() DeleteVariant: EventEmitter<any> = new EventEmitter<any>();
    @Output() SendAttribute: EventEmitter<any> = new EventEmitter<any>();

    @Input() selectedRowData: any;
    @Input() selectedAttributeData: any;
    @Input() selectedRowDataForDelete: any;
    @Input() formAddProduct!: boolean;
    @Input() formEditProduct!: boolean;
    @Input() formSelectAttribute!: boolean;
    @Input() formDeleteProduct!: boolean;
    @Input() formDeleteVariant!: boolean;
	productSuccessMessage = 'Product: ';
	errorMessage = 'Please fill in all the required fields.';
	
    //form group
    addProductForm: FormGroup;
    editProductForm: FormGroup;
    addVariantForm: FormGroup;
    selectedAttributeForms: any[] = [];
    addAttributeForm: FormGroup;
    editVariantForm: FormGroup;
	deleteProductForm: FormGroup;
    selectedAttributeForm: FormGroup;
    
    
    categories!: Observable<AdminCategory[]>;
	attributes!: Observable<AdminCategory[]>;
    products!: Observable<Product[]>;
    
    variantsList: FormArray = this.formBuilder.array([]);
    imageList: FormArray = this.formBuilder.array([]);
    attributesList: FormArray = this.formBuilder.array([]);
    formChangesSubscription: Subscription;

    index: number;
    Additionalindex: number;
    variant_id: string;
    done: boolean;
    cancel: boolean = true; 
    selectedImages: string[] = [];

    selectedAttribute: Attributes[] = [];
    addedAttributes: Attributes[] = [];
    originalSelectedAttribute: Attributes[] = [];
    variantForms: any[] = []; 
    savedVariantForms: any[] = [];
    dynamicFormValues: any[] = [];
    selectedVariantIndex: number | null = null;
    currentlyEditedFormIndex: number | null = null;
    hideVariantValidationContainer: boolean = true;
    showVariantFormContainer: boolean = false;
    fileUrlMap: Map<File, string> = new Map();
    private attributeServiceData: any[] = [];

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
        private cd: ChangeDetectorRef
    ) 
    {
        

        this.selectedAttributeForms = this.attribute_service.getSelectedAttributesForm();
        this.attributesList = this.attribute_service.getSelectedAttributes()
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
            variants: this.formBuilder.array([]), 
        });
        
        this.addVariantForm = this.formBuilder.group({
            name: ['', Validators.required],
            stock: ['', Validators.required],
            price: ['', Validators.required],
            images: this.formBuilder.array([]),
            attributes: this.formBuilder.array([]),
        });

        this.addAttributeForm = this.formBuilder.group({
            value: ['', Validators.required],
        });

        this.selectedAttributeForms.forEach((item) => {
            this.addAttributeForm.addControl(item.id, this.formBuilder.control('', Validators.required));
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
        const imagesArray = this.addVariantForm.get('images') as FormArray;
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileControl = this.formBuilder.control(file);
            imagesArray.push(this.formBuilder.control(file));
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
    
//showVarriant Forms
    showVariantForms(){
        if (!this.isFormSave) {
            const newIndex = this.variantForms.length; 
            this.variantForms.push({ index: newIndex, isVisible: true }); 
            
            this.hideVariantValidationContainer = false
            this.isFormSave = true;
            this.addVariantForm.reset()
        }else{
            const productWarn = {
                errorMessage: 'Add Variant',
                suberrorMessage: 'Save Before You Add Another One!'
            };
            this.ProductWarning.emit(productWarn)
        }
    }
    
//Accordion
    toggleAccordion(index: number) {
        for (let i = 0; i < this.variantForms.length; i++) {
            if (i !== index) {
                this.variantForms[i].isVisible = false;
            }
        }
        this.variantForms[index].isVisible = !this.variantForms[index].isVisible;

    }
    
    selectVariantItem(variant: string, index: number){
        this.removeVariant(index)
    }
    
    editVariant(index: any){

        this.toggleAccordion(index) 
        //this.currentlyEditedFormIndex = index;
    }

    get attributesArray() {
        return this.addVariantForm.get('attributes') as FormArray;
    }
    
    getAllValuesAndPatch() {
        for (let i = 0; i < this.selectedAttributeForms.length; i++) {
            const attributeForm = this.selectedAttributeForms[i];
            const control = this.attributesArray.at(i);
    
            console.log('Value for', attributeForm.name, 'is', control.value);
    
          // You can patch the value to the attributeForm here if needed
            attributeForm.value = control.value;
        }
    
        console.log('Updated selectedAttributeForms:', this.selectedAttributeForms);
    }
    

    saveVariant(index: any){
        const variantsArray = this.addProductForm.get('variants') as FormArray;
        const addVariantForm = this.addVariantForm;
        const attributesArray = this.addVariantForm.get('attributes') as FormArray;

        if (addVariantForm) {
            for (let i = 0; i < this.selectedAttributeForms.length; i++) {
                const items = this.selectedAttributeForms[i];
                const value = this.addAttributeForm.get('value')?.value;

                items.value = value;
                attributesArray.push(this.formBuilder.control(items));
                this.cd.detectChanges();
            }

            const newVariantControl = this.formBuilder.control(addVariantForm.value);
            variantsArray.push(newVariantControl);


            console.log(this.addVariantForm)
            //addVariantForm.reset()

            for (let i = variantsArray.length - 1; i >= 0; i--) {
                if (variantsArray.at(i).value === null) {
                    variantsArray.removeAt(i);
                }
            }
            
            this.isFormSave = false;
        }
        
        this.toggleAccordion(index);
        
    }
    
    removeVariant(index: any){
        this.variantForms.splice(index, 1);
        if(this.variantForms.length < 1){
            this.hideVariantValidationContainer = true
        }
    }

    getVariantIndex(index: any) {
        this.selectedVariantIndex = index;
        this.attribute_service.postIndex(index)
        
    }

//Get and remove attributes
    isSelected(id: string): boolean {
    
        for (const control of this.attributesList.controls) {
            if (control.value.id === id) {
                return true; 
            }
        }
        return false; 
    }
    
    isAttributeSelected(attribute: Attributes): boolean {
        return this.selectedAttribute.some(attr => attr.id === attribute.id);
    }
    isAttributeAdded(attribute: Attributes): boolean {
        return this.addedAttributes.some((attr) => attr.id === attribute.id);
    }
    getAttributeIdValue(): string {
        return this.attributeIdInput.nativeElement.value;
    }
    
    toggleAttribute(id: string, name: string) {
        const selectedCheckboxesIdArray = this.selectedAttributeForm.get('selectedCheckboxesId') as FormArray;
        const idIndex = selectedCheckboxesIdArray.value.indexOf(id);
        
        if (idIndex === -1) {
            const attribute: Attributes = { id, name };
    
            if (!this.isAttributeSelected(attribute)) {
                selectedCheckboxesIdArray.push(new FormControl(id));
                this.selectedAttribute.push(attribute);

            }
        } else {
            selectedCheckboxesIdArray.removeAt(idIndex);
            this.selectedAttribute.splice(idIndex, 1);
            this.selectedAttributeForm.reset()
            this.addedAttributes.splice(idIndex, 1);

        }
        
        if(this.isSelected(id)){
            this.removeAttribute(id)
            this.selectedAttribute.splice(idIndex, 1);
            this.selectedAttributeForm.reset()

        }
    }
    
    onSave() {
        const attributesToAdd = this.selectedAttribute.filter((attr) => !this.isAttributeAdded(attr));
        
        if (attributesToAdd.length > 0) {
            this.attribute_service.postSelectedAttribute(attributesToAdd);

            for (const attribute of attributesToAdd) {
                const addAttributeForm = {
                    id: attribute.id,
                    name: attribute.name,
                    value: '',
                };
                
                this.attribute_service.postSelectedAttributeForm(addAttributeForm); 

            }

            this.addedAttributes.push(...attributesToAdd);
            this.selectedAttribute.splice(0)
            this.selectedAttributeForm.reset();
            this.addedAttributes.splice(0);


        }else{
            console.log('no input', attributesToAdd, this.addedAttributes)
        }   

    }
    
    removeAttribute( id: string ) {
        this.attribute_service.removeSelectedAttribute(id);
        this.attribute_service.removeSelectedAttributeForm(id);
        console.log(this.attributesList, this.addedAttributes)
    }

    cancelAttribute() {
        // console.log(this.selectedAttribute);
    }
    
    onCategorySelect(event: any) {
        const selectedValue = event.target.value;
        console.log(selectedValue);
        // You can now use the selectedValue as needed.
    }
//Submit Functions

//submit products
    async onProductAddSubmit(): Promise<void> {

        console.log(this.addProductForm)
        // const formData: FormData = new FormData();

        // formData.append('name', this.addProductForm.get('name')?.value);
        // formData.append('category', this.addProductForm.get('category')?.value);
        // formData.append('description', this.addProductForm.get('description')?.value);
        // const imageFiles = this.addProductForm.get('images')?.value;
        // const imageFileNames: string[] = [];
        // if (imageFiles) {
        //     for (let i = 0; i < imageFiles.length; i++) {
        //         const file: File = imageFiles[i];
        //         imageFileNames.push(file.name);
        //         formData.append(`images[]`, file);
        //     }
        // }
        // // Append variants to the formData
        // const variantsList = this.addProductForm.get('variants') as FormArray;
        // for (let i = 0; i < variantsList.length; i++) {
        //     const variantFormGroup = variantsList.at(i) as FormGroup;
        //     const variant = variantFormGroup.value;
        //   // Append variant properties as an array
        //     formData.append(`variants[${i}][name]`, variant.name);
        //     formData.append(`variants[${i}][quantity]`, variant.quantity);
        //     formData.append(`variants[${i}][price]`, variant.price.toFixed(2));
        // }

        // // Display the FormData entries
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });

        //append variants to array
        // const variantsList = this.addProductForm.get('variants') as FormArray;
        // for (let i = 0; i < variantsList.length; i++) {
        //     const variantFormGroup = variantsList.at(i) as FormGroup;
        //     const variant = variantFormGroup.value;
        //     formData.append(`variants[${i}][name]`, variant.size);
        //     formData.append(`variants[${i}][quantity]`, variant.stock);
        //     formData.append(`variants[${i}][price]`, variant.price.toFixed(2));
        // }
        

        

        
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
