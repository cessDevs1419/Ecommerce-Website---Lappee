import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, TemplateRef, ChangeDetectorRef, SimpleChanges, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, catchError, combineLatest, debounceTime, filter, first, forkJoin, map, of, startWith, switchMap, tap, throwError } from 'rxjs';

import { AdminCategory, NewAdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { formatAdminCategories, formatAdminCategoriesAttribute, formatAdminProductObj, formatAdminSubcategories, formatAttributes, formatProductObj, formatProducts} from 'src/app/utilities/response-utils';
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
import { RichTextEditorComponent } from '../../rich-text-editor/rich-text-editor.component';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';

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
    formBorderColor: string = "border-grey"
    pagebordercolor: string = 'linear-gradient-border'

    private refreshData$ = new Subject<void>();
	public searchString: string;
    private isFormSave = false
	
	@ViewChild('attributeIdInput') attributeIdInput: ElementRef;
	@ViewChild('rte') childComponent: RichTextEditorComponent;
    @ViewChild('priceInput', { static: false }) priceInputRef!: ElementRef<HTMLInputElement>;
    @ViewChild('openModalBtn') openModalBtn!: ElementRef;
    @ViewChild('modalRef') modalRef!: ElementRef;
    @ViewChild('dismiss1') dismissModal1: ElementRef;
    @ViewChild(RichTextEditorComponent) editor: RichTextEditorComponent;
    
    
    @Output() cancelEditForm: EventEmitter<any> = new EventEmitter();
    @Output() Index: EventEmitter<any> = new EventEmitter();
    @Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
    @Output() ProductWarning: EventEmitter<any> = new EventEmitter();
    @Output() CloseModal: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();
    @Output() DeleteVariant: EventEmitter<any> = new EventEmitter<any>();
    @Output() SendAttribute: EventEmitter<any> = new EventEmitter<any>();
    @Output() hideMinus: EventEmitter<void> = new EventEmitter();
    @Output() cancelVariant: EventEmitter<void> = new EventEmitter();
    
    @Input() selectedRowData: any;
    @Input() selectedAttributeData: any;
    @Input() selectedRowDataForDelete: any;
    @Input() formAddProduct!: boolean;
    @Input() formEditProduct!: boolean;
    @Input() formSelectAttribute!: boolean;
    @Input() formDeleteVariant!: boolean;
    @Input() formDeleteProduct!: boolean;
    @Input() formMultipleDeleteProduct!: boolean;
    @Input() formHideProduct!: boolean;
    @Input() formEditVariant!: boolean;
    @Input() formAddVariant!: boolean;
    
    
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
    productDetails!: Observable<Product>;
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

    stockBorder: boolean = false;
    priceBorder: boolean = false;
    validationStatus: { [key: string]: boolean } = {};
    name: boolean = false;
    
    selectedImages: string[] = [];

    isSelectDisabled: boolean = false;
    hidevariantheader: boolean[] = [];
    selectedAttribute: Attributes[] = [];
    addedAttributes: Attributes[] = [];
    originalSelectedAttribute: Attributes[] = [];
    variantForms: any[] = []; 
    editvariantForms: any[] = []; 
    savedVariantForms: any[] = [];
    dynamicFormValues: any[] = [];
    selectedVariantIndex: number | null = null;
    currentlyEditedFormIndex: number | null = null;
    hideVariantValidationContainer: boolean = true;
    showVariantFormContainer: boolean = false;
    fileUrlMap: Map<File, string> = new Map();
    mystyleImagesMap: Map<File, string> = new Map();
    rowActionVisibility: boolean[] = [];
	activeButtonIndex: number | null = null;
    imageMessage: string
    imageMessageMap: { [fileName: string]: string } = {};
    imageResolutionStates: { [fileName: string]: boolean } = {};
    imageResolutionStatesTooltip: { [fileName: string]: boolean } = {};
    variantsArray: FormArray;
    newvariantsArray: FormArray = this.formBuilder.array([]);
    attributesArrays: FormArray;
    rtfValue: string;
    variantsLists: any[] =[]
    variantsListsData: any[] = []
    private attributeServiceData: any[] = [];
    private editorInitializedSubject: Subject<void> = new Subject<void>();
	isLoading: boolean = true;
    isProductInclude: boolean = false;
    ProductHide: boolean;
    productArchived: number
    attributeArray: any[] = []

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
        private sanitizer: DomSanitizer,
        private errorMessages: ErrorHandlerService
    ) 
    {
        

        this.selectedAttributeForms = this.attribute_service.getSelectedAttributesForm();
        this.attributesList = this.attribute_service.getSelectedAttributes()
        this.variantsList = this.variantService.getVariants()
        
        this.selectedAttributeForm = this.formBuilder.group({
            selectedCheckboxesId: this.formBuilder.array([]),
            selectedCheckboxesName: this.formBuilder.array([])
        });
        
        this.addProductForm = this.formBuilder.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            description: [''],
            include: [0],
            variants: this.formBuilder.array([]), 
        });

        this.editProductForm = this.formBuilder.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            description: [''],
            include: [0],
            variants: this.formBuilder.array([]), 
        });
        
        this.addVariantForm = this.formBuilder.group({
            name: ['', Validators.required],
            stock: [1 , [Validators.required]],
            price: [1 , [Validators.required]],
            images: this.formBuilder.array([]),
            mystyle: this.formBuilder.array([]),
            attributes: this.formBuilder.array([])
        });

        this.editVariantForm = this.formBuilder.group({
            name: ['', Validators.required],
            stock: ['', Validators.required],
            price: ['', Validators.required],
            images: this.formBuilder.array([]),
            mystyle: this.formBuilder.array([]),
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

        if (this.selectedRowData) {
            this.productDetails = this.product_service.getProductDetails(this.selectedRowData).pipe(map((Response: any) => formatProductObj(Response)));

            this.product_service.getAdminProductDetails(this.selectedRowData).subscribe((response: any) => {
                const formattedProduct = formatAdminProductObj(response);
                this.productArchived = formattedProduct.is_archived
                this.addProductForm.get('name')?.setValue(formattedProduct.name);
                this.addProductForm.get('category')?.setValue(formattedProduct.category_id);

                setTimeout(() => {
                    this.addProductForm.get('description')?.setValue(formattedProduct.description);
                    this.editor.editorSetValue(formattedProduct.description);
                }, 1500);
            });
        }


    }



    ngOnDestroy(): void {
        // Clean up the object URLs to avoid memory leaks
        this.variantsListsData.forEach((variantGroup) => {
            const images = variantGroup.get('images') as FormArray;
            images.controls.forEach((imageControl) => {
                const file = imageControl.value;
                if (file instanceof File) {
                    URL.revokeObjectURL(this.getSafeImageUrl(file) as string);
                }
            });
        });
    }
    

	loaded(){
		this.isLoading = false
	}

    isInclude() {
        const currentValue = this.addProductForm.get('include')?.value;
        const newValue = currentValue === 1 ? 0 : 1;
        this.addProductForm.get('include')?.setValue(newValue);
        this.isProductInclude = newValue === 1;
    }
      
    isStockZeroOrNegative(form: FormGroup): boolean {
        const stockControl = form.get('stock');
        if (stockControl?.value <= 0) {
            return true;
        } else {
            return false;
        }
    }

    isPriceZeroOrNegative(form: FormGroup): boolean {
        const priceControl = form.get('price');
        if (priceControl?.value <= 0) {
            return true;
        } else {
            return false;
        }
    }

    getRTFValue(value: any){
        // console.log(value)
        this.rtfValue = value
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
    disableSaveByImageSizeButton(): boolean {
        let warningEmitted = false; // Initialize the flag as false
    
        for (const file of this.addVariantForm.value.images) {
            this.checkImageResolution(file, (width, height, fileName) => {
                const productWarn = {
                    head: 'Add Variant',
                    sub: 'One of the Images Doesnt follow image rules'
                };
                switch (true) {
                    case width < 720 || height < 1080:
                        this.ProductWarning.emit(productWarn);
                        warningEmitted = true;
                        break;
    
                    case width > 2560 || height > 1440:
                        this.ProductWarning.emit(productWarn);
                        warningEmitted = true;
                        break;
                }
            });
    
            if (warningEmitted) {
                return true; 
            }
        }
    
        return false; 
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
                head: 'Add Image',
                sub: 'Image must be no more than 3',
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
                head: 'Add Image',
                sub: 'Image must be no more than 3',
            };
        
            this.ProductWarning.emit(errorDataforProduct);
        }else{

            const addInput = document.getElementById('addimagesedit');
            addInput?.click();
        }
        
        // const editInput = document.getElementById('editimages');
        // editInput?.click();
    }

    selectFileForAddingMyStyleImg() {

        const imageArray = this.getFileKeysMyStyles().length
        if(imageArray >= 1){
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 3',
            };
        
            this.ProductWarning.emit(errorDataforProduct);
        }else{

            const addInput = document.getElementById('addimagesmystyles');
            addInput?.click();
        }

    }

    selectFileForEditingMyStyleImg(index: number) {
        const variantArray =  this.variantsArray
        const variant = variantArray.controls[index]
        const imageArrays = variant.value.images

        const imageArray = this.getFileKeysMyStyles.length
        if(imageArray + imageArrays.length >= 1){
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 1',
            };
        
            this.ProductWarning.emit(errorDataforProduct);
        }else{

            const addInput = document.getElementById('addimageseditmystyles');
            addInput?.click();
        }
        
        // const editInput = document.getElementById('editimages');
        // editInput?.click();
    }

    getFileKeys(): File[] {
        return Array.from(this.fileUrlMap.keys());
    }

    getFileKeysMyStyles(): File[] {
        return Array.from(this.mystyleImagesMap.keys());
    }


    convertFileToUrl(file: File) {
        const reader = new FileReader();

        reader.onload = (event) => {
            this.fileUrlMap.set(file, event.target?.result as string);
        };

        reader.readAsDataURL(file);
    }

    convertFileToUrlMyStyles(file: File) {
        const reader = new FileReader();

        reader.onload = (event) => {
            this.mystyleImagesMap.set(file, event.target?.result as string);
        };

        reader.readAsDataURL(file);
    }

    handleFileInput(event: any) {
        const imagesArray = this.addVariantForm.get('images') as FormArray;
        const files = event.target.files;

        if (files.length + imagesArray.length > 3) {
        
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 3',
            };
        
            this.ProductWarning.emit(errorDataforProduct);

            // for (let i = 0; i < Math.min(files.length, 3); i++) {
            //     const file = files[i];

            //     this.checkImageResolution(file, (width, height, fileName) => {
            //         if (width < 720 || height < 1080) {
            //             this.imageResolutionStates[fileName] = true;
            //         } else if(width > 2560 || height > 1440){
            //             this.imageResolutionStates[fileName] = true;
            //         } else {
            //             this.imageResolutionStates[fileName] = false;
            //         }
            //     });


            //     imagesArray.push(this.formBuilder.control(file));
            //     this.convertFileToUrl(file);
            // }

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

        if (files.length + imagesArray.length > 3) {
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 3',
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
    
    handleFileInputMyStyles(event: any) {
        const imagesArray = this.addVariantForm.get('mystyle') as FormArray;
        const files = event.target.files;

        if (files.length + imagesArray.length > 1) {
        
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 1',
            };
        
            this.ProductWarning.emit(errorDataforProduct);

            for (let i = 0; i < Math.min(files.length, 1); i++) {
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


                if (file.type === 'image/png') {

                    imagesArray.push(this.formBuilder.control(file));
                    this.convertFileToUrlMyStyles(file);
                } else {
                    // Handle non-PNG files (emit a warning, skip, etc.)
                    const errorDataforProduct = {
                        head: 'Add Image',
                        sub: 'Only PNG files are allowed',
                    };
                    this.ProductWarning.emit(errorDataforProduct);
                }
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

                if (file.type === 'image/png') {
                    const fileControl = this.formBuilder.control(file);
                    imagesArray.push(this.formBuilder.control(file));
                    this.product_service.addImageToList(fileControl);
                    this.convertFileToUrlMyStyles(file);
                } else {
                    
                    const errorDataforProduct = {
                        head: 'Add Image',
                        sub: 'Only PNG files are allowed',
                    };
                    this.ProductWarning.emit(errorDataforProduct);
                }
            }

        }

    }

    handleFileInputForEditMyStyles(event: any) {
        const imagesArray = this.addVariantForm.get('mystyle') as FormArray;
        const files = event.target.files;

        if (files.length + imagesArray.length > 1) {
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 3',
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
                this.convertFileToUrlMyStyles(file);
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
                this.convertFileToUrlMyStyles(file);
            }

        }

    }

    removeImage(index: number) {
        const imagesArray = this.addVariantForm.get('images') as FormArray;
        this.product_service.removeImg(index);
        const files = this.getFileKeys();
        if (index >= 0 && index < files.length) {
            const fileToRemove = files[index];
            this.fileUrlMap.delete(fileToRemove);
            imagesArray.removeAt(index);
        }
    }

    removeImageFromEditForm(imageIndex: number, variantIndex: number) {
        const variantFormGroup = this.variantsLists.at(variantIndex) as FormGroup;
    
        if (variantFormGroup) {
            const imagesControl = variantFormGroup.get('images');
            
            if (imagesControl instanceof FormArray) {
                if (imageIndex >= 0 && imageIndex < imagesControl.length) {
                    imagesControl.removeAt(imageIndex);

                } 
            }
        } 
    }

    removeImageMystyleimages(index: number) {
        const imagesArray = this.addVariantForm.get('mystyle') as FormArray;
        const files = this.getFileKeysMyStyles();
        if (index >= 0 && index < files.length) {
            const fileToRemove = files[index];
            this.mystyleImagesMap.delete(fileToRemove);
            imagesArray.removeAt(index);
        }
    }
    

    removeImageFromEditFormMystyleimages(imageIndex: number, variantIndex: number) {
        const variantFormGroup = this.variantsLists.at(variantIndex) as FormGroup;
    
        if (variantFormGroup) {
            const imagesControl = variantFormGroup.get('mystyle');
            
            if (imagesControl instanceof FormArray) {
                if (imageIndex >= 0 && imageIndex < imagesControl.length) {
                    imagesControl.removeAt(imageIndex);

                } 
            }
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
                head: errorMessage,
                sub: errorsArray,
            };
        
            this.ProductWarning.emit(errorDataforProduct);
            
        } else {
            const errorDataforProduct = {
                head: errorMessage,
                sub: 'Please Try Another One',
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
                    head: 'Add Variant',
                    sub: 'Save Before You Add Another One!'
                };
                this.ProductWarning.emit(productWarn)
            }
        }else{
            const productWarn = {
                head: 'Add Variant',
                sub: 'Select Category First!'
            };
            this.ProductWarning.emit(productWarn)
        }

    }

    showNewVariantForms(){
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
                head: 'Add Variant',
                sub: 'Save Before You Add Another One!'
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

    toggleEditAccordion(index: number) {
        for (let i = 0; i < this.editvariantForms.length; i++) {
            if (i !== index) {
                this.editvariantForms[i].isVisible = false;
            }
        }
        this.editvariantForms[index].isVisible = !this.editvariantForms[index].isVisible;

    }
    
    selectVariantItem( index: number){
        this.removeVariant(index)
    }



    selectVariantDataItem(id: string){
        this.removeEditVariant(id)
    }

    editVariant(index: any){
        this.toggleAccordion(index) 
        this.hideVariantValidationContainer = false
        this.addBtn = false;
        this.editBtn = true;
        this.editAttributes = false
        this.editImages = false
        this.addVariantForm.patchValue({
            name: this.variantsLists[index].value.name,
            stock: this.variantsLists[index].value.stock,
            price: this.variantsLists[index].value.price,
        });
        const variantsList = this.variantsLists[index].value;
        this.attributeArray.splice(0)
        for (let attribute of  variantsList.attributes) {
            this.addAttributeForm.get(attribute.id)?.setValue(attribute.value)
            const Attributes = {
                category_attribute_id: attribute.id,
                name: attribute.name,
                value: attribute.value
            }
            this.attributeArray.push(Attributes)
        }
        
    }

    selectNewVariantItem( index: number){
        this.removeVariant(index)
    }

    editNewVariant(index: any){
        this.toggleAccordion(index) 
        this.hideVariantValidationContainer = false
        this.addBtn = false;
        this.editBtn = true;
        this.editAttributes = false
        this.editImages = false
        this.addVariantForm.patchValue({
            name: this.variantsLists[index].value.name,
            stock: this.variantsLists[index].value.stock,
            price: this.variantsLists[index].value.price,
        });
    }

    // editDataVariant(index: any, id: string){
    //     this.toggleEditAccordion(index)
    //     this.hideVariantValidationContainer = false
    //     this.addBtn = false;
    //     this.editBtn = true;
    //     this.editAttributes = false
    //     this.editImages = false

    //     const variant = this.variantsListsData[index];
    //     console.log(variant.value.attributes)
    //     this.attributeFormsArray


    //     if (variant) {
    //         this.addVariantForm.get('name')?.setValue(variant.value.name);
    //         this.addVariantForm.get('stock')?.setValue(variant.value.stock);
    //         this.addVariantForm.get('price')?.setValue(variant.value.price);
    //     }

    // }


    editProductVariant(index: any){
        this.product_service.getProductDetails(this.selectedRowData).subscribe((response: any) => {
            const formattedProduct = formatProductObj(response);
            const variants = formattedProduct.variants[index]
            const attributes = variants.attributes
            this.addVariantForm.patchValue({
                name: variants.variant_name,
                stock: variants.stock,
                price: variants.price,
            });
        });
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

    separator(data:string, index:number): string{
        const splitdata = data
        return splitdata[index];
    }

    setColorData(data: any, item: any){
        this.addAttributeForm.get(item.category_attribute_id)?.setValue(data)
    }

    saveVariant(index: any){
        const variantsArray = this.addProductForm.get('variants') as FormArray;
        const addVariantForm = this.addVariantForm;
        const attributesArray = this.addVariantForm.get('attributes') as FormArray;
        const imagesArray = this.addVariantForm.get('images') as FormArray;
        const imagesArrayValue = imagesArray.value

        if (this.isStockZeroOrNegative(addVariantForm) && this.isPriceZeroOrNegative(addVariantForm)) {
            const errorDataforProduct = {
                head: 'Invalid Input',
                sub: 'Stocks and Price has invalid inputs'
            };
            this.stockBorder = true
            this.priceBorder = true
            this.ProductError.emit(errorDataforProduct);
            return;
        }
        
        if (this.isStockZeroOrNegative(addVariantForm)) {
            const errorDataforProduct = {
                head: 'Invalid Input',
                sub: 'Stocks has invalid inputs'
            };
            this.stockBorder = true
            this.ProductError.emit(errorDataforProduct);
            return;
        }
        
        if (this.isPriceZeroOrNegative(addVariantForm)) {
            const errorDataforProduct = {
                head: 'Invalid Input',
                sub: 'Price has invalid inputs'
            };
            this.priceBorder = true
            this.ProductError.emit(errorDataforProduct);
            return;
        }else{
            this.priceBorder = false
        }
        
        if (imagesArray.value.length === 0) {
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Please Add Image'
            };

            this.ProductError.emit(errorDataforProduct);
            return;
        }
        
        if(!this.addAttributeForm.valid){

            const invalidControls = [];
            const emptyFields: any[] = [];
            for (const controlName in this.addAttributeForm.controls) {
                if (this.addAttributeForm.controls.hasOwnProperty(controlName)) {
                const control = this.addAttributeForm.get(controlName);
                    if (control && control.invalid) {
                        invalidControls.push(controlName);
                    }
                }
            }

            invalidControls.forEach((controlName) => {
                this.validationStatus[controlName] = true;
            });

            invalidControls.forEach((invalidControlName) => {
                const matchingAttribute = this.attributeFormsArray.find(attribute => attribute.id === invalidControlName);
                if (matchingAttribute) {
                    emptyFields.push(matchingAttribute.name)
                }
            });

            const errorDataforProduct = {
                head: this.errorMessage,
                sub: emptyFields.join(', ')
            };
        
            this.ProductError.emit(errorDataforProduct);

            return
        }


        if (addVariantForm.valid) {

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
            const newVariantGroup = this.formBuilder.group({
                name: [addVariantForm.value.name],
                price: [addVariantForm.value.price],
                stock: [addVariantForm.value.stock],
                attributes: [addVariantForm.value.attributes],
                images: this.formBuilder.array(addVariantForm.value.images),
                mystyle: this.formBuilder.array(addVariantForm.value.mystyle)
            });
            
            const newVariantVisible = this.formBuilder.group({
                ...addVariantForm.value,
                isVisible: true, 
            });
            
            this.hideVariantValidationContainer = true;
            this.newvariantsArray.push(newVariantVisible);
            variantsArray.push(newVariantGroup);
            this.variantsLists.push(newVariantGroup);
            this.toggleAccordion(index);
        
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
            this.mystyleImagesMap.clear();
            while (attributesArray.length !== 0) {
                attributesArray.removeAt(0);
            }
            while (imagesArray.length !== 0) {
                imagesArray.removeAt(0);
            }
            this.product_service.removeAllImg();
            this.isFormSave = false;
            if(this.variantsLists.length > 0){
                this.addProductForm.get('category')?.disable()
            }

        }else{
            addVariantForm.markAllAsTouched();
            this.addAttributeForm.markAllAsTouched();

            const emptyFields = [];
            for (const controlName in addVariantForm.controls) {
                if ( addVariantForm.controls.hasOwnProperty(controlName)) {
                    const productcontrol = addVariantForm.controls[controlName];
                    if (productcontrol.errors?.['required'] && productcontrol.invalid ) {
                        const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                        emptyFields.push(label);
                        
                    }
                    
                    
                }
            }

            const errorDataforProduct = {
                head: this.errorMessage,
                sub: emptyFields.join(', ')
            };


            this.ProductError.emit(errorDataforProduct);
        }

    
    }

    saveNewVariant(index: any){
        const variantsArray = this.addProductForm.get('variants') as FormArray;
        const addVariantForm = this.addVariantForm;
        const addAttributeForm = this.addAttributeForm;
        const attributesArray = this.addVariantForm.get('attributes') as FormArray;
        const imagesArray = this.addVariantForm.get('images') as FormArray;
        const imagesArrayValue = imagesArray.value

        
        if (this.isStockZeroOrNegative(addVariantForm) && this.isPriceZeroOrNegative(addVariantForm)) {
            const errorDataforProduct = {
                head: 'Invalid Input',
                sub: 'Stocks and Price has invalid inputs'
            };
            this.stockBorder = true
            this.priceBorder = true
            this.ProductError.emit(errorDataforProduct);
            return;
        }
        
        if (this.isStockZeroOrNegative(addVariantForm)) {
            const errorDataforProduct = {
                head: 'Invalid Input',
                sub: 'Stocks has invalid inputs'
            };
            this.stockBorder = true
            this.ProductError.emit(errorDataforProduct);
            return;
        }
        
        if (this.isPriceZeroOrNegative(addVariantForm)) {
            const errorDataforProduct = {
                head: 'Invalid Input',
                sub: 'Price has invalid inputs'
            };
            this.priceBorder = true
            this.ProductError.emit(errorDataforProduct);
            return;
        }else{
            this.priceBorder = false
        }
        
        if (imagesArray.value.length === 0) {
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Please Add Image'
            };

            this.ProductError.emit(errorDataforProduct);
            return;
        }
        

        if (addVariantForm.valid) {

            const formControls = this.addAttributeForm.controls;
            const attributeFormsArray = this.attributeFormsArray;

            this.attributeFormsArray.forEach((attributeForm) => {
                const existingIndex = attributesArray.controls.findIndex(existingFormGroup => existingFormGroup.get('id')?.value === attributeForm.id);
      
                if (existingIndex !== -1) {
                    const existingFormGroup = attributesArray.at(existingIndex) as FormGroup;
                    existingFormGroup.get('value')?.setValue(attributeForm.value);
                } else {
                    Object.keys(this.addAttributeForm.value).forEach((item: any) => {
                        if(item === attributeForm.category_attribute_id){
                            const newAttributeFormGroup = this.formBuilder.group({
                                id: [attributeForm.category_attribute_id],
                                name: [attributeForm.name],
                                value: [this.addAttributeForm.get(`${item}`)?.value],
                            });
                            attributesArray.push(newAttributeFormGroup);
                            
                        }
                    })
                    
                }
            });

            const newVariantGroup = this.formBuilder.group({
                name: [addVariantForm.value.name],
                price: [addVariantForm.value.price],
                stock: [addVariantForm.value.stock],
                attributes: [addVariantForm.value.attributes],
                images: this.formBuilder.array(addVariantForm.value.images),
                mystyle: this.formBuilder.array(addVariantForm.value.mystyle)
            });
            
            const newVariantVisible = this.formBuilder.group({
                ...addVariantForm.value,
                isVisible: true, 
            });
            
            this.hideVariantValidationContainer = true;
            this.newvariantsArray.push(newVariantVisible);
            variantsArray.push(newVariantGroup);
            this.variantsLists.push(newVariantGroup);
            this.toggleAccordion(index);
        
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
            this.mystyleImagesMap.clear();
            while (attributesArray.length !== 0) {
                attributesArray.removeAt(0);
            }
            while (imagesArray.length !== 0) {
                imagesArray.removeAt(0);
            }
            this.product_service.removeAllImg();
            this.isFormSave = false;
            if(this.variantsLists.length > 0){
                this.addProductForm.get('category')?.disable()
            }

        }else{
            addVariantForm.markAllAsTouched();
            this.addAttributeForm.markAllAsTouched();

            const emptyFields = [];
            for (const controlName in addVariantForm.controls) {
                if ( addVariantForm.controls.hasOwnProperty(controlName)) {
                    const productcontrol = addVariantForm.controls[controlName];
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

    saveNewEditedVariant(index: any){
        const variantsArray = this.addProductForm.get('variants') as FormArray;
        const addVariantForm = this.addVariantForm;
        const addAttributeForm = this.addAttributeForm;
        const attributesArray = this.addVariantForm.get('attributes') as FormArray;
        const imagesArray = this.addVariantForm.get('images') as FormArray;
        const imagesArrayValue = imagesArray.value

        
        if (this.isStockZeroOrNegative(addVariantForm) && this.isPriceZeroOrNegative(addVariantForm)) {
            const errorDataforProduct = {
                head: 'Invalid Input',
                sub: 'Stocks and Price has invalid inputs'
            };
            this.stockBorder = true
            this.priceBorder = true
            this.ProductError.emit(errorDataforProduct);
            return;
        }
        
        if (this.isStockZeroOrNegative(addVariantForm)) {
            const errorDataforProduct = {
                head: 'Invalid Input',
                sub: 'Stocks has invalid inputs'
            };
            this.stockBorder = true
            this.ProductError.emit(errorDataforProduct);
            return;
        }
        
        if (this.isPriceZeroOrNegative(addVariantForm)) {
            const errorDataforProduct = {
                head: 'Invalid Input',
                sub: 'Price has invalid inputs'
            };
            this.priceBorder = true
            this.ProductError.emit(errorDataforProduct);
            return;
        }else{
            this.priceBorder = false
        }
        
        if (imagesArray.value.length === 0) {
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Please Add Image'
            };

            this.ProductError.emit(errorDataforProduct);
            return;
        }
        

        if (addVariantForm.valid) {

            const formControls = this.addAttributeForm.controls;
            const attributeFormsArray = this.attributeFormsArray;

            this.attributeFormsArray.forEach((attributeForm) => {
                const existingIndex = attributesArray.controls.findIndex(existingFormGroup => existingFormGroup.get('id')?.value === attributeForm.id);
      
                if (existingIndex !== -1) {
                    const existingFormGroup = attributesArray.at(existingIndex) as FormGroup;
                    existingFormGroup.get('value')?.setValue(attributeForm.value);
                } else {
                    Object.keys(this.addAttributeForm.value).forEach((item: any) => {
                        if(item === attributeForm.category_attribute_id){
                            const newAttributeFormGroup = this.formBuilder.group({
                                id: [attributeForm.category_attribute_id],
                                name: [attributeForm.name],
                                value: [this.addAttributeForm.get(`${item}`)?.value],
                            });
                            attributesArray.push(newAttributeFormGroup);
                            
                        }
                    })
                    
                }
            });

            const newVariantGroup = this.formBuilder.group({
                name: [addVariantForm.value.name],
                price: [addVariantForm.value.price],
                stock: [addVariantForm.value.stock],
                attributes: [addVariantForm.value.attributes],
                images: this.formBuilder.array(addVariantForm.value.images),
                mystyle: this.formBuilder.array(addVariantForm.value.mystyle)
            });
            
            const newVariantVisible = this.formBuilder.group({
                ...addVariantForm.value,
                isVisible: true, 
            });
            
            this.hideVariantValidationContainer = true;
            this.newvariantsArray.push(newVariantVisible);
            variantsArray.push(newVariantGroup);
            this.variantsLists.push(newVariantGroup);
            this.toggleAccordion(index);
        
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
            this.mystyleImagesMap.clear();
            while (attributesArray.length !== 0) {
                attributesArray.removeAt(0);
            }
            while (imagesArray.length !== 0) {
                imagesArray.removeAt(0);
            }
            this.product_service.removeAllImg();
            this.isFormSave = false;
            if(this.variantsLists.length > 0){
                this.addProductForm.get('category')?.disable()
            }

        }else{
            addVariantForm.markAllAsTouched();
            this.addAttributeForm.markAllAsTouched();

            const emptyFields = [];
            for (const controlName in addVariantForm.controls) {
                if ( addVariantForm.controls.hasOwnProperty(controlName)) {
                    const productcontrol = addVariantForm.controls[controlName];
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
    
    saveEditedVariant(index: any){
        const variants = this.addVariantForm;
        const variantsArray = this.addProductForm.get('variants') as FormArray;
        const attributesArray = this.addVariantForm.get('attributes') as FormArray;
        const imagesArray = this.addVariantForm.get('images') as FormArray;
        const mystyle = this.addVariantForm.get('mystyle') as FormArray;
        const formControls = this.addAttributeForm.controls;
        const attributeFormsArray = this.attributeFormsArray;
        const attribute = variantsArray.value[index].attributes
        const variantsList = this.variantsLists

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
        
        const newVariantGroup = this.formBuilder.group({
            name: [variants.value.name],
            price: [variants.value.price],
            stock: [variants.value.stock],
            attributes: [variants.value.attributes],
            images: this.formBuilder.array([]),
            mystyle: this.formBuilder.array([])
        });

        if (Array.isArray(imagesArray.value)) {
            const imagesArrays = newVariantGroup.get('images') as FormArray;
            imagesArrays.clear();

            for (const item of variantsList[index].value.images) {
                newVariantGroup.value.images?.push(item);
            }
            for (const item of imagesArray.value) {
                newVariantGroup.value.images?.push(item);
            }
        }

        if (Array.isArray(mystyle.value)) {
            const mystyle = newVariantGroup.get('mystyle') as FormArray;
            mystyle.clear();

            for (const item of variantsList[index].value.images) {
                newVariantGroup.value.images?.push(item);
            }
            for (const item of imagesArray.value) {
                newVariantGroup.value.images?.push(item);
            }
        }


        for (const file of (newVariantGroup.value.images || []) as File[]) {
            this.checkImageResolution(file, (width, height, fileName) => {
                if (width < 720 || height < 1080) {
                    const productWarn = {
                        head: 'Add Variant',
                        sub: 'One of Images is Too Small'
                    };
                    this.ProductWarning.emit(productWarn);
                } else if (width > 2560 || height > 1440) {
                    const productWarn = {
                        head: 'Add Variant',
                        sub: 'One of Images is Too Large'
                    };
                    this.ProductWarning.emit(productWarn);
                } else {
                    this.hideVariantValidationContainer = true
                    if (index >= 0 && index < variantsArray.length) {
                        this.variantsArray.removeAt(index);
                        this.variantsArray.push(newVariantGroup);
                    }
                    
                    if (this.variantsLists) {
                        this.variantsLists.splice(index, 1);
                        this.variantsLists.push(newVariantGroup);
                    }
                    
                    const productSuccess = {
                        head: 'Edit Variant',
                        sub: 'Successfully Edit Variant'
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
                    this.mystyleImagesMap.clear();
                    while (attributesArray .length !== 0) {
                        attributesArray .removeAt(0);
                    }
                    while (imagesArray.length !== 0) {
                        imagesArray.removeAt(0);
                    }
                    this.product_service.removeAllImg();
                    this.isFormSave = false;
                }
            });
        }

        this.toggleAccordion(index);

    }
    

    removeVariant(index: any){
        const attributesArray = this.addVariantForm.get('attributes') as FormArray;
        const imagesArray = this.addVariantForm.get('images') as FormArray;
        const myStyle = this.addVariantForm.get('images') as FormArray;
        const variants = this.addVariantForm.get('variants') as FormArray;
        this.newvariantsArray.removeAt(index)
        this.variantForms.splice(index, 1);
        this.addAttributeForm.reset();
        this.fileUrlMap.clear();
        this.mystyleImagesMap.clear();
        // variants.removeAt(index)

        if(this.variantForms.length < 1){
            this.hideVariantValidationContainer = true
        }
        while (attributesArray.length !== 0) {
            attributesArray.removeAt(0);
        }
        this.variantsLists.splice(index);
        while (imagesArray.length !== 0) {
            imagesArray.removeAt(0);
            imagesArray.clear();
        }
        while (myStyle.length !== 0) {
            myStyle.removeAt(0);
            myStyle.clear();
        }
        this.isFormSave = false;
    }

    removeEditVariant(id: any){
        console.log(id)
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

    // pag test ni dell sa color picker component
    // checkValue(): void {
    //     for(let field in this.addAttributeForm.controls){
    //         console.log(field + " hex: " + this.addAttributeForm.get(field)?.value[1])
    //         console.log(field + " name: " + this.addAttributeForm.get(field)?.value[0])
    //     }
    // }

//submit products
    async onProductAddSubmit(): Promise<void> {

        // console.log(this.addProductForm)

        const productFormData: FormData = new FormData();
        let productName = this.addProductForm.get('name')?.value;
        const capitalizedName = productName.charAt(0).toUpperCase() + productName.slice(1);
        
        // Add Product Fields
        productFormData.append('name', capitalizedName)
        productFormData.append('category', this.addProductForm.get('category')?.value);
        productFormData.append('description', this.rtfValue);
        productFormData.append('show_my_styles', this.addProductForm.get('include')?.value);
        console.log(this.addProductForm.get('include')?.value)
        // Get Variants
        const variantsList = this.variantsLists;

        for (let i = 0; i < variantsList.length; i++) {
            const variantFormGroup = variantsList.at(i) as FormGroup;
            const variant = variantFormGroup.value;
        
            productFormData.append(`variants[${i}][name]`, variant.name);
            productFormData.append(`variants[${i}][stock]`, variant.stock);
            productFormData.append(`variants[${i}][price]`, variant.price.toFixed(2));

            let imageIndex = 0;
            let attributeIndex = 0;

            for (let image of variant.images) {
                productFormData.append(`variants[${i}][images][${imageIndex}]`, image);
                imageIndex++;
            }

            for (let image of variant.mystyle) {
                productFormData.append(`variants[${i}][my_style_image]`, image);
                imageIndex++;
            }


            for (let attribute of variant.attributes) {
                let valueToAppend = Array.isArray(attribute.value) ? attribute.value[0] : attribute.value;
                productFormData.append(`variants[${i}][attributes][${attributeIndex}][category_attribute_id]`, attribute.id);
                productFormData.append(`variants[${i}][attributes][${attributeIndex}][value]`, attribute.value);
                attributeIndex++;
            }
        }

        // Display the FormData entries
        // productFormData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });
        
        if(this.addProductForm.valid){
        
            this.product_service.postProduct(productFormData).subscribe({
                next: (response: any) => { 
                    
                    const productSuccess = {
                        head: 'Add Product',
                        sub: response.message
                    };
                
                    this.RefreshTable.emit();
                    this.ProductSuccess.emit(productSuccess);
                    this.addProductForm.reset();
                    this.addVariantForm.reset();
                    this.addAttributeForm.reset();
                    this.variantsArray.reset();
                    this.variantsList.clear();
                    this.variantForms.splice(0);
                    this.attributeFormsArray.splice(0);
                    this.newvariantsArray.clear()
                    this.imageList.clear();
                    this.addBtn = true;
                    this.editBtn = false;
                    this.editAttributes = true
                    this.variantsLists.splice(0)
                    this.childComponent.editorReset();
                    this.addProductForm.get('category')?.enable()
                    this.addProductForm.get('include')?.enable()
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
                            head: 'Error Invalid Inputs',
                            sub: errorsArray,
                        };
                    
                        this.ProductWarning.emit(errorDataforProduct);
                    } else {
                    
                        const errorDataforProduct = {
                            head: 'Error Invalid Inputs',
                            sub: 'Please Try Another One',
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
                head: this.errorMessage,
                sub: emptyFields.join(', ')
            };

            this.ProductError.emit(errorDataforProduct);
        }
    
    }

    async onProductEditSubmit(): Promise<void> {


        const productFormData: FormData = new FormData();
        let productName = this.addProductForm.get('name')?.value;
        const capitalizedName = productName.charAt(0).toUpperCase() + productName.slice(1);
        this.productArchived
        productFormData.append('id', this.selectedRowData )
        productFormData.append('name', capitalizedName)
        productFormData.append('description', this.rtfValue);
        productFormData.append('is_archived', this.productArchived.toString());


        productFormData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        
        this.product_service.patchProduct(productFormData).subscribe({
            next: (response: any) => { 
                
                const productSuccess = {
                    head: 'Edit Product',
                    sub: response.message
                };
            
                this.RefreshTable.emit();
                this.ProductSuccess.emit(productSuccess);
                this.cancelAction()
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
                        head: 'Error Invalid Inputs',
                        sub: errorsArray,
                    };
                
                    this.ProductWarning.emit(errorDataforProduct);
                } else {
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: 'Please Try Another One',
                    };
                    this.ProductError.emit(errorDataforProduct);
                }
                return throwError(() => error);
                
            }
        });
    
    }
    
    onProductDeleteSubmit(){

        const selectedId: any[] = []
        if(this.selectedRowData){
            selectedId.push(this.selectedRowData.product_id)
        }else{

            for(let id of this.selectedRowDataForDelete){
                selectedId.push(id)
            }
            
        }

        // for (const value of formData.entries()) {
        //     console.log(`${value[0]}, ${value[1]}`);
        // }

        this.product_service.deleteProduct(selectedId).subscribe({
            next: (response: any) => { 
                const successMessage = {
                    head: 'Delete Attribute ',
                    sub: response?.message
                };
                this.CloseModal.emit();
                this.RefreshTable.emit();
                this.refreshTableData();
                this.hideMinus.emit()
                this.ProductSuccess.emit(successMessage);
            
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
    }

    onProductHideSubmit(){
        let formData: any = new FormData();
        const selectedCategory : any[] = []
        selectedCategory.push(this.selectedRowData.id)
        
        for (let id of selectedCategory) {
            let index = 0;
            formData.append('id', id);
            index++;
        }

        formData.forEach((value: any, key: number) => {
            console.log(`${key}: ${value}`);
        });

        this.product_service.patchVisibilityProduct(formData).subscribe({
            next: async(response: any) => { 
            
                const successMessage = {
                    head: 'Hide Product',
                    sub: response?.message
                };
                
                this.RefreshTable.emit();
                
                this.refreshTableData();
                this.ProductSuccess.emit(successMessage);

            
                this.CloseModal.emit();
            },
            error: (error: HttpErrorResponse) => {
                const customErrorMessages = {
                    head: 'Hide Product',
                    sub: this.errorMessages.handle(error),
                };
                
                const errorData = this.errorService.handleError(error, customErrorMessages);
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



