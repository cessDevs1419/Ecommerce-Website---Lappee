import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { Observable, Subject, combineLatest, startWith, switchMap, tap, throwError } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { AdminProduct, NewVariant, Product, ProductList } from 'src/assets/models/products';
import { formatAdminCategoriesAttribute, formatAdminProducts, formatAdminSubcategories, formatNewProductVariant, formatProducts } from 'src/app/utilities/response-utils';
import { map } from 'rxjs';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { ModalComponent } from 'src/app/components/components/modal/modal.component';
import { VariantsService } from 'src/app/services/variants/variants.service';
import { VariantsFormComponent } from 'src/app/components/components/Forms/variants-form/variants-form.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminCategory, NewAdminCategory } from 'src/assets/models/categories';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { RichTextEditorComponent } from 'src/app/components/components/rich-text-editor/rich-text-editor.component';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { ColorPickerComponent } from 'src/app/components/components/color-picker/color-picker.component';

@Component({
    selector: 'app-admin-products',
    templateUrl: './admin-products.component.html',
    styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent {
    @ViewChild(ModalComponent) modal: ModalComponent;
    @ViewChild(ToasterComponent) toaster: ToasterComponent;
    @ViewChild('triggerFunction') childComponent: TableComponent;
    @ViewChild(TableComponent) table: TableComponent;
    @ViewChild('tableFunction') tableFunction: TableComponent;
    @ViewChild(VariantsFormComponent) variantForms: VariantsFormComponent;
    @ViewChild(RichTextEditorComponent) editor: RichTextEditorComponent;
    @ViewChild(ColorPickerComponent) colorPicker: ColorPickerComponent;
    
    
    products!: Observable<AdminProduct[]>;
    sub_categories: Observable<AdminSubcategory[]>;
    variantsNew: Observable<NewVariant[]>
    titleColor: string = 'color-adm-light-gray';
    modalClass: string = 'modal-xl'
    modalVariants: boolean = true
    modalAddVariant: boolean = false
    modalEditVariant: boolean = false
    textColor: string = 'text-secondary';
    borderColor: string = '';
    backGround: string = '';
    btncolor: string = 'btn-primary glow-primary'
    isProductInclude: boolean = false
	private refreshData$ = new Subject<void>();
    showEditForms: boolean;
    showAddForms: boolean;
    

    selectedRowData: any;
    selectedRowDataForDelete: any;
    categoryId: string;
    variantForm: FormGroup;
    attributeForm: FormGroup;
    productForm: FormGroup;
    
    /*classes*/
	margin = "mx-lg-2"
	size = "w-100 me-2"
    formColor: string = "dark-form-bg"
    formTextColor: string = "dark-theme-text-color"
    formInputColor: string = "text-white"
    formBorderColor: string = "border-grey"
    pagebordercolor: string = 'linear-gradient-border'
    

    productDetails!: Observable<Product>;
    categories!: Observable<AdminCategory[]>;
    attributes!: Observable<NewAdminCategory[]>;
    categoryAttributes!: Observable<NewAdminCategory>;
    attributeFormsArray: any[] = [];
    stockBorder: boolean = false;
    priceBorder: boolean = false;
    validationStatus: { [key: string]: boolean } = {};
    name: boolean = false;
    imageMessage: string
    imageMessageMap: { [fileName: string]: string } = {};
    imageResolutionStates: { [fileName: string]: boolean } = {};
    imageResolutionStatesTooltip: { [fileName: string]: boolean } = {};
    fileUrlMap: Map<File, string> = new Map();
    mystyleImagesMap: Map<File, string> = new Map();
    attributeArray: any[] = []
    imagesArray: any[] = []
    mystyleimageArray: any[] = []
    //theme

    showMinus: boolean
    backdrop: string = 'true';
    toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  
    counter_bg: string = 'table-bg-dark'
    counter_heading_text_color: string = 'dark-theme-heading-text-color'
    text_color: string = 'dark-theme-text-color'
    variantId: string = ''
    colors: string = ''
    productsLength: number
    countlowstocks: number
	constructor(
		private service: ProductsService,
		private subcategory_service: SubcategoriesService,
        private variant_service: VariantsService,
		private router: Router,
        private variants_service: VariantsService,
        private formBuilder: FormBuilder,
        private category_service: CategoriesService,
        private sanitizer: DomSanitizer,
	) {

        this.productForm = this.formBuilder.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            description: [''],
            include: [0],
            variants: this.formBuilder.array([]), 
          });  
    
          this.variantForm = this.formBuilder.group({
              name: ['', Validators.required],
              stock: [1 , [Validators.required]],
              price: [1 , [Validators.required]],
              images: this.formBuilder.array([]),
              mystyle: this.formBuilder.array([]),
              attributes: this.formBuilder.array([])
          });

          this.attributeForm = this.formBuilder.group({});
    
    }
	
	ngOnInit(): void{
		this.products = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.service.getAdminProducts()),
            map((Response: any) => formatAdminProducts(Response))  
            ,
            tap(() => {
                this.table.loaded()
            })
        );
        this.products.subscribe((data:any) => {
            this.productsLength = data.length
        })
	}
	
    refreshTableData(): void {
        this.refreshData$.next();
    }

    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
        
    }

    onRowDataForDelete(rowData: any){
        this.selectedRowDataForDelete = rowData;
    }
    
    showMinusFunction(){
        this.childComponent.removeAllSelected();
    }
	
    showAddForm(): void{
        this.router.navigate(['/admin/product-management','product','add']);
	    // this.showAddForms = true
	}
	
    showEditForm(row: any): void{
        this.router.navigate(['/admin/product-management','product','edit',row.id]);
        // this.showAddForms = false
	}

    showVariantForm(row: any): void{
        this.variantsNew = this.variants_service.getProductVariants(row.id).pipe(map((Response: any) => formatNewProductVariant(Response)))
        this.variantsNew.subscribe((data: any) => {
            if(data){
                this.tableFunction.loaded()
            }
        })
        // this.showAttribute(row.category_id)
        this.showAttribute(row.category_id)
	}
    
    showVariants(data: any){
        this.variantsNew = data
    }

    showAddButton(){
        this.modalVariants = false
        this.modalAddVariant = true
        this.modalClass = 'modal-md'

    }

    showEditButton(data: any){
        this.modalVariants = false
        this.modalEditVariant = true
        this.modalClass = 'modal-md'
        const imagesArray = this.variantForm.get('images') as FormArray;
        imagesArray.clear()
        this.getFileKeys().splice(0)
        this.fileUrlMap.clear()
        this.imagesArray.splice(0)
        this.attributeForm.reset()
        this.attributeArray.splice(0)

        Object.keys(data).forEach((keys: any) => {
            if (data.hasOwnProperty(keys)) {
                this.variantId = data['id']
                this.variantForm.get('name')?.setValue(data['name'])
                this.variantForm.get('stock')?.setValue(data['stock'])
                this.variantForm.get('price')?.setValue(data['price'])
            }   
        })

        for (const attri of data['attributes']) {
           for (let attributeName in this.attributeForm.controls) {
                if (attributeName === attri.category_attribute_id) {
                    const addAttributeForm = {
                        attribute_id: attri.attribute_id,
                        category_attribute_id: attri.category_attribute_id,
                        name: attri.attribute_name,
                        value: attri.value
                    };
                   this.attributeForm.get(attributeName)?.setValue(attri.value)
                   this.attributeArray.push(addAttributeForm);
                }

            }
        }

        for (const image of data['images']) {
            this.imagesArray.push(image);
        }

        for (const image of data['my_style_image']) {
            this.mystyleimageArray.push(image);
        }

    }

    cancelAddVariants(){
        this.modalVariants = true 
        this.modalAddVariant = false
        this.modalEditVariant = false
        this.modalClass = 'modal-xl'
        this.variantForm.reset()
        this.attributeForm.reset()
        this.attributeFormsArray.splice(0)

        const imagesArray = this.variantForm.get('images') as FormArray;
        imagesArray.clear()
        this.getFileKeys().splice(0)
        this.fileUrlMap.clear()
        this.imagesArray.splice(0)

        this.variantsNew.subscribe((data: any) => {
            if(data){
                this.tableFunction.loaded()
            }
        })
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
    
    showAttribute(category: string){
        this.categoryAttributes = this.category_service.getCategoryAttribute(category).pipe(map((Response: any) => formatAdminCategoriesAttribute(Response)));
        // this.categoryAttributes.subscribe((data: NewAdminCategory) => {
        //     if (data && data.attributes) {
                
        //         for (const attribute of data.attributes) {
        //             const addAttributeForm = {
        //                 id: attribute.category_attribute_id,
        //                 name: attribute.name,
        //                 value: ''
        //             }; 
        //             this.attributeForm.addControl(attribute.category_attribute_id, new FormControl('', Validators.required));
        //             this.attributeFormsArray.push(addAttributeForm);
                    
        //         }
        //     }
        // });
        this.categoryAttributes.subscribe((data: NewAdminCategory) => {
            for (const attribute of data.attributes) {
                const addAttributeForm = {
                    category_attribute_id: attribute.category_attribute_id,
                    name: attribute.name,
                    value: ''
                }; 
                this.attributeForm.addControl(attribute.category_attribute_id, new FormControl('', Validators.required));
                this.attributeFormsArray.push(addAttributeForm);
                
            }
        });
        
    }
    


    isInclude() {
        const currentValue = this.productForm.get('include')?.value;
        const newValue = currentValue === 1 ? 0 : 1;
        this.productForm.get('include')?.setValue(newValue);
        this.isProductInclude = newValue === 1;
    }

    onCategorySelect(event: any) {
        const selectedValue = event.target.value;
        // this.editAttributes = true
        // this.addAttributeForm.reset()
        // this.attributeFormsArray.splice(0)
        const formGroup = this.attributeForm; 
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
                    this.attributeForm.addControl(attribute.category_attribute_id, new FormControl('', Validators.required));
                    this.attributeFormsArray.push(addAttributeForm);
                    
                }
            }
        });
    }

    selectFileForAddingMyStyleImg() {

        const imageArray = this.getFileKeysMyStyles().length
        if(imageArray >= 1){
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 3',
            };
        
            this.WarningToast(errorDataforProduct);
        }else{

            const addInput = document.getElementById('addimagesmystyles');
            addInput?.click();
        }

    }

    selectFileForAdding() {

        const imageArray = this.getFileKeys().length
        if(this.imagesArray.length+imageArray >= 3 ){
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 3',
            };
        
            this.WarningToast(errorDataforProduct);
        }else{

            const addInput = document.getElementById('addimages');
            addInput?.click();
        }

    }

    getFileKeys(): File[] {
        return Array.from(this.fileUrlMap.keys());
    }

    getFileKeysMyStyles(): File[] {
        return Array.from(this.mystyleImagesMap.keys());
    }

    getSafeImageUrl(file: File) {
        const objectURL = URL.createObjectURL(file);
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
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
        const imagesArray = this.variantForm.get('images') as FormArray;
        const files = event.target.files;

        if (files.length + imagesArray.length > 3) {
        
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 3',
            };
        
            this.WarningToast(errorDataforProduct);


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
                this.convertFileToUrl(file);
            }

        }

    }

    handleFileInputMyStyles(event: any) {
        const imagesArray = this.variantForm.get('mystyle') as FormArray;
        const files = event.target.files;

        if (files.length + imagesArray.length > 1) {
        
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 1',
            };
        
            this.WarningToast(errorDataforProduct);

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
                    this.WarningToast(errorDataforProduct);
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
                    
                    this.convertFileToUrlMyStyles(file);
                } else {
                    
                    const errorDataforProduct = {
                        head: 'Add Image',
                        sub: 'Only PNG files are allowed',
                    };
                    this.WarningToast(errorDataforProduct);
                }
            }

        }

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

    checkImageResolution(file: File, callback: (width: number, height: number, fileName: string) => void) {
        const img = new Image();
    
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            
            callback(width, height, file.name);
        };
    
        img.src = URL.createObjectURL(file);
    }

    removeImageMystyleimages(index: number) {
        const imagesArray = this.variantForm.get('mystyle') as FormArray;
        const files = this.getFileKeysMyStyles();
        if (index >= 0 && index < files.length) {
            const fileToRemove = files[index];
            this.mystyleImagesMap.delete(fileToRemove);
            imagesArray.removeAt(index);
        }
    }

    removeImage(index: number) {
        const imagesArray = this.variantForm.get('images') as FormArray;

        const files = this.getFileKeys();
        if (index >= 0 && index < files.length) {
            const fileToRemove = files[index];
            this.fileUrlMap.delete(fileToRemove);
            imagesArray.removeAt(index);
        }
    }

    SuccessToast(value: any): void {
        this.toaster.showToast(value.head, value.sub, 'default', '', )
    }
    
    WarningToast(value: any): void {
        this.toaster.showToast(value.head, value.sub, 'warn', '', )
    }
    
    ErrorToast(value: any): void {
        this.toaster.showToast(value.head, value.sub, 'negative', '', )
    }
    
    onVariantAddSubmit(){
        console.log(this.variantForm)
        console.log(this.attributeForm)

        const productFormData: FormData = new FormData();

        
        const name = this.variantForm.get('name')?.value
        const price = this.variantForm.get('price')?.value
        const images = this.variantForm.get('images')?.value

        productFormData.append(`variant_id`, this.variantId);
        productFormData.append(`name`, name);
        productFormData.append(`price`, price);

        let imageIndex = 0;
        let attributeIndex = 0;

        for (let image of images) {
            productFormData.append(`images`, image);
            imageIndex++;
        }

        // for (let image of variant.mystyle) {
        //     productFormData.append(`variants[${i}][my_style_image]`, image);
        //     imageIndex++;
        // }


        // for (let attribute of variant.attributes) {
        //     let valueToAppend = Array.isArray(attribute.value) ? attribute.value[0] : attribute.value;
        //     productFormData.append(`variants[${i}][attributes][${attributeIndex}][category_attribute_id]`, attribute.id);
        //     productFormData.append(`variants[${i}][attributes][${attributeIndex}][value]`, valueToAppend);
        //     attributeIndex++;
        // }

        // Display the FormData entries
        productFormData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
    }
    
    onVariantEditSubmit(){
   
        console.log(this.attributeForm)

        const productFormData: FormData = new FormData();

        
        const name = this.variantForm.get('name')?.value
        const price = this.variantForm.get('price')?.value
        const images = this.variantForm.get('images')?.value

        productFormData.append(`variant_id`, this.variantId);
        productFormData.append(`name`, name);
        productFormData.append(`price`, price);

        let imageIndex = 0;
        let attributeIndex = 0;

        for (let attributeName in this.attributeForm.controls) {
            for (let attribute of this.attributeArray) {
                const existingValue = attribute.value
                const newValue = this.attributeForm.get(attributeName)?.value


                if (attributeName === attribute.category_attribute_id) {
                    if(newValue){
                        productFormData.append(`[attributes][${attributeIndex}][category_attribute_id]`, attribute.category_attribute_id);
                        productFormData.append(`[attributes][${attributeIndex}][value]`, newValue);
                        attributeIndex++;
                    }else{
                        productFormData.append(`[attributes][${attributeIndex}][category_attribute_id]`, attribute.category_attribute_id);
                        productFormData.append(`[attributes][${attributeIndex}][value]`, existingValue);
                        attributeIndex++;
                    }
                }


            }
            

        }

        for (const image of this.imagesArray) {
            productFormData.append(`images[]`, image);
        }

        for (let image of images) {
            productFormData.append(`images[]`, image);
            imageIndex++;
        }

        productFormData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        this.variant_service.patchVariants(productFormData).subscribe({
            next: (response: any) => { 
                    
                const productSuccess = {
                    head: 'Edit Product',
                    sub: response.message
                };
            
                this.refreshTableData()
                this.SuccessToast(productSuccess);
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
                
                    this.WarningToast(errorDataforProduct);
                } else {
                
                    const errorDataforProduct = {
                        head: 'Error Invalid Inputs',
                        sub: 'Please Try Another One',
                    };
                    this.ErrorToast(errorDataforProduct);
                }
                return throwError(() => error);
                
            }
        })
        
    }

	

}
