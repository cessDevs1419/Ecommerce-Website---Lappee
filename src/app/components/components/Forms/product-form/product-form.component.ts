import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, TemplateRef, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, combineLatest, filter, first, forkJoin, map, of, startWith, switchMap, tap, throwError } from 'rxjs';

import { AdminCategory, NewAdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { formatAdminCategories, formatAdminCategoriesAttribute, formatAdminSubcategories, formatAttributes, formatProducts} from 'src/app/utilities/response-utils';
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
import { DomSanitizer } from '@angular/platform-browser';

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
    pagebordercolor: string = 'linear-gradient-border'

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
    editAttributeForm: FormGroup;
    editVariantForm: FormGroup;
	deleteProductForm: FormGroup;
    selectedAttributeForm: FormGroup;
    editAttributes:boolean = false;
    editImages:boolean = false
    
    categories!: Observable<AdminCategory[]>;
	attributes!: Observable<NewAdminCategory[]>;
	categoryAttributes!: Observable<NewAdminCategory>;
    products!: Observable<Product[]>;
    
    variantsList: FormArray = this.formBuilder.array([]);
    imageList: FormArray = this.formBuilder.array([]);
    attributesList: FormArray = this.formBuilder.array([]);
    attributeFormsArray: any[] = [];

    formChangesSubscription: Subscription;

    index: number;
    Additionalindex: number;
    variant_id: string;
    done: boolean;
    cancel: boolean = true; 
    addBtn: boolean = false; 
    editBtn: boolean = false; 

    selectedImages: string[] = [];

    hidevariantheader: boolean[] = [];
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
    rowActionVisibility: boolean[] = [];
	activeButtonIndex: number | null = null;
    imageMessage: string
    imageMessageMap: { [fileName: string]: string } = {};
    imageResolutionStates: { [fileName: string]: boolean } = {};
    imageResolutionStatesTooltip: { [fileName: string]: boolean } = {};
    variantsArray: FormArray;
    newvariantsArray: FormArray = this.formBuilder.array([]);
    attributesArrays: FormArray;


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
        private cd: ChangeDetectorRef,
        private sanitizer: DomSanitizer
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

        this.editProductForm = this.formBuilder.group({
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

        this.editVariantForm = this.formBuilder.group({
            name: ['', Validators.required],
            stock: ['', Validators.required],
            price: ['', Validators.required],
            images: this.formBuilder.array([]),
            attributes: this.formBuilder.array([]),
        });

        this.addAttributeForm = this.formBuilder.group({});

        this.selectedAttributeForms.forEach((item) => {
            this.addAttributeForm.addControl(item.id, this.formBuilder.control('', Validators.required));
        });
        

        this.variantsArray = this.addProductForm.get('variants') as FormArray;
        // this.variantForms.push({ index: 0, isVisible: true });
        // this.isFormSave = false
    }
    
    ngOnInit(): void{
		this.categories = this.category_service.getAdminCategories().pipe(map((Response: any) => formatAdminCategories(Response)));
        
        this.products = this.product_service.getAdminProducts().pipe(map((Response: any) => formatProducts(Response)));
        
        // this.attributes = this.refreshData$.pipe(
        //     startWith(undefined), 
        //     switchMap(() => this.attribute_service.getAttribute()),
        //     map((Response: any) => formatAttributes(Response))
        // );
	
    }
    
    getSafeImageUrl(file: File) {
        const objectURL = URL.createObjectURL(file);
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }

    refreshTableData(): void {
        this.refreshData$.next();
    }
    
    showToolTip(file: File, index: number){
        this.checkImageResolution(file, (width, height, fileName) => {
            if (width < 720 || height < 1080) {
                this.imageResolutionStatesTooltip[fileName] = true;
                this.imageMessage = "The image must be at least 720px x 1080p."
            } else if(width > 2560 || height > 1440){
                this.imageResolutionStatesTooltip[fileName] = true;
                this.imageMessage = "Images up to 1440px x 2560px only."
            } else {
                this.imageResolutionStatesTooltip[fileName] = false;
            }
        });
    }

    unshowToolTip(file: File){
        this.checkImageResolution(file, (width, height, fileName) => {
            if (width < 720 || height < 1080) {
                this.imageResolutionStatesTooltip[fileName] =  false;
            } else if(width > 2560 || height > 1440){
                this.imageResolutionStatesTooltip[fileName] = false;
            } else {
                this.imageResolutionStatesTooltip[fileName] = false;
            }
        });
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

    showAction(rowIndex: number) {
		this.rowActionVisibility[rowIndex] = !this.rowActionVisibility[rowIndex];

		for (let i = 0; i < this.rowActionVisibility.length; i++) {
			if (i !== rowIndex) {
				this.rowActionVisibility[i] = false;
			}
		}
		
		if (this.activeButtonIndex === rowIndex) {

			this.activeButtonIndex = null;
		} else {
			this.activeButtonIndex = rowIndex;
		}
	}

    disableButton() {
        return this.attributeFormsArray.length < 1;
    }

    disableProductButton() {
        return this.addProductForm.get('variants')?.value.length < 1;
    }

    disableCategorySelect() {
        return this.addProductForm.get('variants')?.value.length > 0;
    }

    checkImageResolution(file: File, callback: (width: number, height: number, fileName: string) => void) {
        const img = new Image();
    
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            
            callback(width, height, file.name);
        };
    
        img.src = URL.createObjectURL(file);
    }
    
//Get Image Value to Array
    selectFileForAdding() {

        const imageArray = this.getFileKeys().length
        if(imageArray >= 3){
            const errorDataforProduct = {
                errorMessage: 'Add Image',
                suberrorMessage: 'Image must be no more than 3',
            };
        
            this.ProductWarning.emit(errorDataforProduct);
        }else{

            const addInput = document.getElementById('addimages');
            addInput?.click();
        }

    }

    selectFileForEditing(index: number) {
        const variantArray =  this.variantsArray
        const variant = variantArray.controls[index]
        const imageArrays = variant.value.images

        const imageArray = this.getFileKeys().length
        if(imageArray + imageArrays.length >= 3){
            const errorDataforProduct = {
                errorMessage: 'Add Image',
                suberrorMessage: 'Image must be no more than 3',
            };
        
            this.ProductWarning.emit(errorDataforProduct);
        }else{

            const addInput = document.getElementById('addimagesedit');
            addInput?.click();
        }
        
        // const editInput = document.getElementById('editimages');
        // editInput?.click();
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

        if (files.length > 3) {
            const errorDataforProduct = {
                errorMessage: 'Add Image',
                suberrorMessage: 'Image must be no more than 3',
            };
        
            this.ProductWarning.emit(errorDataforProduct);

            for (let i = 0; i < Math.min(files.length, 3); i++) {
                const file = files[i];

                this.checkImageResolution(file, (width, height, fileName) => {
                    if (width < 720 || height < 1080) {
                        this.imageResolutionStates[fileName] = true;
                    } else if(width > 2560 || height > 1440){
                        this.imageResolutionStates[fileName] = true;
                    } else {
                        this.imageResolutionStates[fileName] = false;
                    }
                });

                const fileControl = this.formBuilder.control(file);
                imagesArray.push(this.formBuilder.control(file));
                this.product_service.addImageToList(fileControl);
                this.convertFileToUrl(file);
            }

        }else{

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                this.checkImageResolution(file, (width, height, fileName) => {
                    if (width < 720 || height < 1080) {
                        this.imageResolutionStates[fileName] = true;
                    } else if(width > 2560 || height > 1440){
                        this.imageResolutionStates[fileName] = true;
                    } else {
                        this.imageResolutionStates[fileName] = false;
                    }
                });

                const fileControl = this.formBuilder.control(file);
                imagesArray.push(this.formBuilder.control(file));
                this.product_service.addImageToList(fileControl);
                this.convertFileToUrl(file);
            }

        }

    }

    handleFileInputForEdit(event: any) {
        const imagesArray = this.addVariantForm.get('images') as FormArray;
        const files = event.target.files;

        if (files.length > 3) {
            const errorDataforProduct = {
                errorMessage: 'Add Image',
                suberrorMessage: 'Image must be no more than 3',
            };
        
            this.ProductWarning.emit(errorDataforProduct);

            for (let i = 0; i < Math.min(files.length, 3); i++) {
                const file = files[i];

                this.checkImageResolution(file, (width, height, fileName) => {
                    if (width < 720 || height < 1080) {
                        this.imageResolutionStates[fileName] = true;
                    } else if(width > 2560 || height > 1440){
                        this.imageResolutionStates[fileName] = true;
                    } else {
                        this.imageResolutionStates[fileName] = false;
                    }
                });

                const fileControl = this.formBuilder.control(file);
                imagesArray.push(this.formBuilder.control(file));
                this.product_service.addImageToList(fileControl);
                this.convertFileToUrl(file);
            }

        }else{

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                this.checkImageResolution(file, (width, height, fileName) => {
                    if (width < 720 || height < 1080) {
                        this.imageResolutionStates[fileName] = true;
                    } else if(width > 2560 || height > 1440){
                        this.imageResolutionStates[fileName] = true;
                    } else {
                        this.imageResolutionStates[fileName] = false;
                    }
                });

                const fileControl = this.formBuilder.control(file);
                imagesArray.push(this.formBuilder.control(file));
                this.product_service.addImageToList(fileControl);
                this.convertFileToUrl(file);
            }

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

    removeImageFromEditForm(index: number, variantIndex: number) {
        const variantArray = this.addProductForm.get('variants') as FormArray;
        const variant = variantArray.at(variantIndex) as FormGroup; 
        const imagesArray = variant.get('images') as FormArray;
    
        console.log(variantArray);
        console.log(variant);
        console.log(imagesArray);

        // if (images && images.length > index) {
        //     images.removeAt(index);
        //     console.log(images)
        // }
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
    
    handleResponse(response: any): void {
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
        if(this.attributeFormsArray.length > 0)
        {
            if (!this.isFormSave || this.variantForms.length < 1) {
                const newIndex = this.variantForms.length; 
                this.variantForms.push({ index: newIndex, isVisible: true }); 
                
                this.hideVariantValidationContainer = false
                this.isFormSave = true;
                this.addBtn = true;
                this.editBtn = false;
                this.editAttributes = true
                this.editImages = true
                this.addVariantForm.reset()
            }else{
                const productWarn = {
                    errorMessage: 'Add Variant',
                    suberrorMessage: 'Save Before You Add Another One!'
                };
                this.ProductWarning.emit(productWarn)
            }
        }else{
            const productWarn = {
                errorMessage: 'Add Variant',
                suberrorMessage: 'Select Category First!'
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
    
    selectVariantItem( index: number){
        this.removeVariant(index)
    }
    
    editVariant(index: any){
        this.toggleAccordion(index) 
        this.hideVariantValidationContainer = false
        this.addBtn = false;
        this.editBtn = true;
        this.editAttributes = false
        this.editImages = false
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
        const imagesArray = this.addVariantForm.get('images') as FormArray;

        if (addVariantForm) {
            const formControls = this.addAttributeForm.controls;
            const attributeFormsArray = this.attributeFormsArray;

            Object.keys(formControls).forEach((controlName: string) => {
                const controlValue = formControls[controlName].value;
                const attributeIndex = attributeFormsArray.findIndex((attributeForm: any) => attributeForm.id === controlName);
            
                if (attributeIndex !== -1) {
                    attributeFormsArray[attributeIndex].value = controlValue;
                }
            });

            this.attributeFormsArray.forEach((attributeForm) => {
                const existingIndex = attributesArray.controls.findIndex(existingFormGroup => existingFormGroup.get('id')?.value === attributeForm.id);

                if (existingIndex !== -1) {
                    // If the ID already exists, update the existing form group
                    const existingFormGroup = attributesArray.at(existingIndex) as FormGroup;
                    existingFormGroup.get('value')?.setValue(attributeForm.value);
                } else {
                    // If the ID doesn't exist, create a new form group
                    const newAttributeFormGroup = this.formBuilder.group({
                        id: [attributeForm.id],
                        name: [attributeForm.name],
                        value: [attributeForm.value],
                    });
                    attributesArray.push(newAttributeFormGroup);
                }
            });

            const newVariantControl = this.formBuilder.control(addVariantForm.value);
            const newVariantVisible = this.formBuilder.group({
                ...addVariantForm.value,
                isVisible: true, 
            });

            this.hideVariantValidationContainer = true
            this.newvariantsArray.push(newVariantVisible);
            variantsArray.push(newVariantControl);

            const productSuccess = {
                head: 'Add Variant',
                sub: 'Successfully Add Variant'
            };
        
            this.RefreshTable.emit();
            this.ProductSuccess.emit(productSuccess);
            for (let i = variantsArray.length - 1; i >= 0; i--) {
                if (variantsArray.at(i).value === null) {
                    variantsArray.removeAt(i);
                }
            }
            this.addAttributeForm.reset();
            this.fileUrlMap.clear();
            while (attributesArray .length !== 0) {
                attributesArray .removeAt(0);
            }
            while (imagesArray.length !== 0) {
                imagesArray.removeAt(0);
            }
            this.product_service.removeAllImg();
            this.isFormSave = false;
        }
        this.toggleAccordion(index);
    
    }

    saveEditedVariant(index: any){
        const variants = this.addVariantForm;
        const variantsArray = this.addProductForm.get('variants') as FormArray;
        const attributesArray = this.addVariantForm.get('attributes') as FormArray;
        const formControls = this.addAttributeForm.controls;
        const attributeFormsArray = this.attributeFormsArray;
        const attribute = variantsArray.value[index].attributes


        Object.keys(formControls).forEach((controlName: string) => {
                const controlValue = formControls[controlName].value;
                const attributeIndex = attributeFormsArray.findIndex((attributeForm: any) => attributeForm.id === controlName);
            
                if (attributeIndex !== -1) {
                    attributeFormsArray[attributeIndex].value = controlValue;
                }
        });

        this.attributeFormsArray.forEach((attributeForm) => {
            const existingIndex = attributesArray.controls.findIndex(existingFormGroup => existingFormGroup.get('id')?.value === attributeForm.id);
            const correspondingAttribute = attribute.find((attr: any) => attr.id === attributeForm.id);
            
            if (existingIndex !== -1) {
            
                const existingFormGroup = attributesArray.at(existingIndex) as FormGroup;
                const existingAttributes = attribute.at(existingIndex) as FormGroup;

                if (attributeForm.value === null) {
                    existingFormGroup.get('value')?.setValue(correspondingAttribute.value);
                }else{
                    existingFormGroup.get('value')?.setValue(attributeForm.value);
                }
            } else {
            
                if (attributeForm.value === null) {
                    // Create a new attribute form group with the value from correspondingAttribute
                    const newAttributeFormGroup = this.formBuilder.group({
                        id: [attributeForm.id],
                        name: [attributeForm.name],
                        value: [correspondingAttribute.value],
                    });
            
                    attributesArray.push(newAttributeFormGroup);
                } else {
                    // Create a new attribute form group with the value from attributeForm
                    const newAttributeFormGroup = this.formBuilder.group({
                        id: [attributeForm.id],
                        name: [attributeForm.name],
                        value: [attributeForm.value],
                    });
                    attributesArray.push(newAttributeFormGroup);
                }
            }
        });
        

        const newVariantControl = this.formBuilder.control(variants.value);

        if (index >= 0 && index < variantsArray.length) {
            variantsArray.at(index).patchValue(newVariantControl);
        }

        console.log(this.addProductForm.value);
        this.toggleAccordion(index);

    }
    
    removeVariant(index: any){
        const attributesArray = this.addVariantForm.get('attributes') as FormArray;
        const imagesArray = this.addVariantForm.get('images') as FormArray;
        this.newvariantsArray.removeAt(index)
        this.variantForms.splice(index, 1);
        this.addAttributeForm.reset();
        this.fileUrlMap.clear();
        if(this.variantForms.length < 1){
            this.hideVariantValidationContainer = true
        }
        while (attributesArray .length !== 0) {
            attributesArray .removeAt(0);
        }
        while (imagesArray.length !== 0) {
            imagesArray.removeAt(0);
        }
        this.isFormSave = false;
    }

    getVariantIndex(index: any) {
        this.selectedVariantIndex = index;
        this.attribute_service.postIndex(index)
        
    }

    onCategorySelect(event: any) {
        const selectedValue = event.target.value;
        this.editAttributes = true
        this.addAttributeForm.reset()
        this.attributeFormsArray.splice(0)
        const formGroup = this.addAttributeForm; 
        const controlNames = Object.keys(formGroup.controls);
        controlNames.forEach((controlName) => {
            formGroup.removeControl(controlName);
        });

        this.categoryAttributes = this.category_service.getCategoryAttribute(selectedValue).pipe(map((Response: any) => formatAdminCategoriesAttribute(Response)));
        this.categoryAttributes.subscribe((data: NewAdminCategory) => {
            if (data && data.attributes) {
                
                for (const attribute of data.attributes) {
                    const addAttributeForm = {
                        id: attribute.category_attribute_id,
                        name: attribute.name,
                        value: ''
                    }; 
                    this.addAttributeForm.addControl(attribute.category_attribute_id, new FormControl('', Validators.required));
                    this.attributeFormsArray.push(addAttributeForm);
                }
            }
        });
    }
    
//Submit Functions

//submit products
    async onProductAddSubmit(): Promise<void> {

        console.log(this.addProductForm)

        const productFormData: FormData = new FormData();
        let productName = this.addProductForm.get('name')?.value;
        const capitalizedName = productName.charAt(0).toUpperCase() + productName.slice(1).toLowerCase();
        // Add Product Fields
        productFormData.append('name', capitalizedName)
        productFormData.append('category', this.addProductForm.get('category')?.value);
        productFormData.append('description', this.addProductForm.get('description')?.value);

        // Get Variants
        const variantsList = this.addProductForm.get('variants') as FormArray;

        for (let i = 0; i < variantsList.length; i++) {
            const variantFormGroup = variantsList.at(i) as FormGroup;
            const variant = variantFormGroup.value;
        
            productFormData.append(`variants[${i}][name]`, variant.name);
            productFormData.append(`variants[${i}][stock]`, variant.stock);
            productFormData.append(`variants[${i}][price]`, variant.price.toFixed(2));

            for (let image of variant.images) {
                let index = 0;
                productFormData.append(`variants[${i}][images][${index}]`, image);
                index++;
            }

            for (let attribute of variant.attributes) {
                let index = 0;
                productFormData.append(`variants[${i}][attributes][${index}][category_attribute_id]`, attribute.id);
                productFormData.append(`variants[${i}][attributes][${index}][value]`, attribute.value);
                index++;
            }
        }

        // Display the FormData entries
        productFormData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        
        // if(this.addProductForm.valid){
        
        //     this.product_service.postProduct(productFormData).subscribe({
        //         next: (response: any) => { 
                    
        //             const productSuccess = {
        //                 head: 'Add Product',
        //                 sub: response.message
        //             };
                
        //             this.RefreshTable.emit();
        //             this.ProductSuccess.emit(productSuccess);
        //             this.addProductForm.reset();
        //             this.addVariantForm.reset();
        //             this.addAttributeForm.reset();
        //             this.variantsArray.reset();
        //             this.variantsList.clear();
        //             this.variantForms.splice(0);
        //             this.attributeFormsArray.splice(0);
        //             this.newvariantsArray.clear()
        //             this.imageList.clear();
        //             this.addBtn = true;
        //             this.editBtn = false;
        //             this.editAttributes = true
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
    

}

//Get and remove attributes
    // isSelected(id: string): boolean {
    
    //     for (const control of this.attributesList.controls) {
    //         if (control.value.id === id) {
    //             return true; 
    //         }
    //     }
    //     return false; 
    // }
    
    // isAttributeSelected(attribute: Attributes): boolean {
    //     return this.selectedAttribute.some(attr => attr.id === attribute.id);
    // }
    // isAttributeAdded(attribute: Attributes): boolean {
    //     return this.addedAttributes.some((attr) => attr.id === attribute.id);
    // }
    
    // getAttributeIdValue(): string {
    //     return this.attributeIdInput.nativeElement.value;
    // }
    
    // toggleAttribute(id: string, name: string) {
    //     const selectedCheckboxesIdArray = this.selectedAttributeForm.get('selectedCheckboxesId') as FormArray;
    //     const idIndex = selectedCheckboxesIdArray.value.indexOf(id);
        
    //     if (idIndex === -1) {
    //         const attribute: Attributes = { id, name };
    
    //         if (!this.isAttributeSelected(attribute)) {
    //             selectedCheckboxesIdArray.push(new FormControl(id));
    //             this.selectedAttribute.push(attribute);

    //         }
    //     } else {
    //         selectedCheckboxesIdArray.removeAt(idIndex);
    //         this.selectedAttribute.splice(idIndex, 1);
    //         this.selectedAttributeForm.reset()
    //         this.addedAttributes.splice(idIndex, 1);

    //     }
        
    //     if(this.isSelected(id)){
    //         this.removeAttribute(id)
    //         this.selectedAttribute.splice(idIndex, 1);
    //         this.selectedAttributeForm.reset()

    //     }
    // }
    
    // onSave() {
    //     const attributesToAdd = this.selectedAttribute.filter((attr) => !this.isAttributeAdded(attr));
        
    //     if (attributesToAdd.length > 0) {
    //         this.attribute_service.postSelectedAttribute(attributesToAdd);

    //         for (const attribute of attributesToAdd) {
    //             const addAttributeForm = {
    //                 id: attribute.id,
    //                 name: attribute.name,
    //                 value: '',
    //             };
                
    //             this.attribute_service.postSelectedAttributeForm(addAttributeForm); 

    //         }

    //         this.addedAttributes.push(...attributesToAdd);
    //         this.selectedAttribute.splice(0)
    //         this.selectedAttributeForm.reset();
    //         this.addedAttributes.splice(0);


    //     }else{
    //         console.log('no input', attributesToAdd, this.addedAttributes)
    //     }   

    // }
    
    // removeAttribute( id: string ) {
    //     this.attribute_service.removeSelectedAttribute(id);
    //     this.attribute_service.removeSelectedAttributeForm(id);
    //     console.log(this.attributesList, this.addedAttributes)
    // }

    // cancelAttribute() {
    //     // console.log(this.selectedAttribute);
    // }