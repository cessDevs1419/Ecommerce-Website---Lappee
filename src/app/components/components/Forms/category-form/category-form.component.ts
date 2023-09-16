import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Observable, Subject, map, startWith, switchMap, take, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastComponent } from '../../toast/toast.component';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { AdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { formatAdminCategories, formatAdminSubcategories, formatAttributes } from 'src/app/utilities/response-utils';
import { ErrorHandlingService } from 'src/app/services/errors/error-handling-service.service';
import { Router } from '@angular/router';
import { ModalComponent } from '../../modal/modal.component';
import { Location } from '@angular/common';
import { AttributesService } from 'src/app/services/attributes/attributes.service';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFormComponent {
    
    public searchString: string;

    @Output() CategorySuccess: EventEmitter<any> = new EventEmitter();
    @Output() CategoryWarn: EventEmitter<any> = new EventEmitter();
	@Output() CategoryError: EventEmitter<any> = new EventEmitter();
	@Output() CloseModal: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();


    @Input() formAddCategory!: boolean;
    @Input() formEditCategory!: boolean;
    @Input() formDeleteCategory!: boolean;
    @Input() formTitle!: string;
    @Input() formsubTitle!: string;
    
    @Input() formAddSubCategory!: boolean;
    @Input() formEditSubCategory!: boolean;
    @Input() formDeleteSubCategory!: boolean;
    @Input() selectedRowData: any;
    @Input() refreshTable: any;
    
    addAttributeForm: FormGroup;
    addCategoryForm: FormGroup;
    editCategoryForm: FormGroup;
    deleteCategoryForm: FormGroup;
    
    addSubCategoryForm: FormGroup;
    editSubCategoryForm: FormGroup;
    deleteSubCategoryForm: FormGroup;

    attributeId: FormArray;
    
    selectedAttributeForm: FormGroup;
    
    attributes!: Observable<AdminCategory[]>;
    categories!: Observable<AdminCategory[]>;
    sub_categories!: Observable<AdminSubcategory[]>;
    
    private refreshData$ = new Subject<void>();

    editCategories: string;
    editSubCategories: string;
    
    modal: ModalComponent;
    done: boolean;
    cancel: boolean = true;
    
    constructor(
        private category_service: CategoriesService,
        private subcategory_service: SubcategoriesService,
        private attribute_service: AttributesService,
        private formBuilder: FormBuilder,
        private errorService: ErrorHandlingService,
        private http: HttpClient,
        private router: Router,
        private location: Location
    ) 
    {
        this.addCategoryForm = this.formBuilder.group({
            category: new FormControl('', Validators.required)
        });

        this.editCategoryForm = new FormGroup({
            //main_category_id: new FormControl('', Validators.required),
            category: new FormControl('', Validators.required)
        });
        
        
    }

    ngOnInit(): void {
    
        this.attributes = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.attribute_service.getAttribute()),
            map((Response: any) => formatAttributes(Response))
        );
        
        this.categories = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.category_service.getAdminCategories()),
            map((Response: any) => formatAdminCategories(Response))
        );
        
        this.sub_categories = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.subcategory_service.getAdminSubcategories()),
            map((Response: any) => formatAdminSubcategories(Response))
        );
        
        // this.categories.subscribe((categories: any[]) => { 
        //     this.editCategories = categories.find(category => category.id === this.selectedRowData)?.name || 'error';
            
        //     this.editCategoryForm.patchValue({
        //         category: this.editCategories ? this.editCategories : null
        //     });
        // });
        
        // this.sub_categories.subscribe((sub_categories: any[]) => { 
        //     this.editSubCategories = sub_categories.find(sub_category => sub_category.id === this.selectedRowData)?.name || 'error';
            
        //     this.editSubCategoryForm.patchValue({
        //         sub_category: this.editSubCategories ? this.editSubCategories : null
        //     });
        // });
        

    }
    
    refreshTableData(): void {
        this.refreshData$.next();
    }


    
    //ADD SUB CATEGORY
    asyncTask(): Promise<void> {
        // Simulate an asynchronous task with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve();
            }, 2500); 
        });
    }

    //Submit Functions
    
    onCategoryAddSubmit(): void {
        let formData: any = new FormData();
            formData.append('name', this.addCategoryForm.get('category')?.value);

            
            for (const value of formData.entries()) {
                console.log(`${value[0]}, ${value[1]}`);
            }
        // if(this.addCategoryForm.valid){

            
        //     let formData: any = new FormData();
        //     formData.append('name', this.addCategoryForm.get('category')?.value);
            
        //     const selectedAttribute = this.selectedAttributeForm.get('selectedCheckboxesId') as FormArray;
        //     for (let i = 0; i < selectedAttribute.length; i++) {
        //         const selectedAttributeFormGroup = selectedAttribute.at(i) as FormGroup;
        //         const attribute = selectedAttributeFormGroup.value;
        //         formData.append(`attributes[${i}]`, attribute);
        //     }
            
        //     for (const value of formData.entries()) {
        //         console.log(`${value[0]}, ${value[1]}`);
        //     }
            
        //     this.category_service.postCategory(formData).subscribe({
        //         next: (response: any) => { 
        //             const successMessage = {
        //                 head: 'Category ' + this.addCategoryForm.get('category')?.value,
        //                 sub: response?.message
        //             };
                    
        //             this.RefreshTable.emit();
        //             this.refreshTableData();
        //             this.CategorySuccess.emit(successMessage);
        //             this.addCategoryForm.reset();
        //             this.done = true
        //             this.cancel = false
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
                    
        //                 this.CategoryWarn.emit(errorDataforProduct);
        //             } else {
                    
        //                 const errorDataforProduct = {
        //                     errorMessage: 'Error Invalid Inputs',
        //                     suberrorMessage: 'Please Try Another One',
        //                 };
        //                 this.CategoryError.emit(errorDataforProduct);
        //             }
        //             return throwError(() => error);
                    
        //         }
        //     });
        
        
        // }else{
        //     this.addCategoryForm.markAllAsTouched();
        //     const emptyFields = [];
        //     for (const controlName in this.addCategoryForm.controls) {
        //         if (this.addCategoryForm.controls.hasOwnProperty(controlName) && this.addCategoryForm.controls[controlName].errors?.['required']) {
        //             const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
        //             emptyFields.push(label);
        //         }
        //     }

        //     const errorData = {
        //         errorMessage: `Please fill in the following required fields: `,
        //         suberrorMessage: emptyFields.join(', ')
        //     };
        //     this.CategoryWarn.emit(errorData);
            
        // }
        
        //console.log(this.addCategoryForm.get('category')?.value, this.selectedAttributeForm.value)

    }

    async onCategoryEditSubmit() {
        
        let formData: any = new FormData();
        formData.append('id', this.selectedRowData.id);
        formData.append('name', this.editCategoryForm.get('category')?.value);

        
        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        }
        
        // if(this.editCategoryForm.valid){

        //     let formData: any = new FormData();
        //     formData.append('id',  this.selectedRowData);
        //     formData.append('name', this.editCategoryForm.get('category')?.value);        

                
        //     this.category_service.patchCategory(formData).subscribe({
        //         next: async(response: any) => { 
        //             const successMessage = {
        //                 head: 'Category ' + this.addCategoryForm.get('category')?.value,
        //                 sub: response?.message
        //             };
                    
        //             this.RefreshTable.emit();
        //             this.refreshTableData();
        //             this.CategorySuccess.emit(successMessage);
        //             this.editCategoryForm.reset();
        //             this.done = true
        //             this.cancel = false
                    
        //             await this.asyncTask();
        //             this.router.navigate(['/admin/category-management']);

        //         },
        //         error: (error: HttpErrorResponse) => {
        //             const errorData = this.errorService.handleError(error);
        //             if (errorData.errorMessage === 'Unexpected Error') {
        //                 this.CategoryError.emit(errorData);
        //             } else {
        //                 this.CategoryWarn.emit(errorData);
        //             }
        //             return throwError(() => error);
        //         }

        //     });
            

        // }
            
        // else if(this.editCategoryForm.invalid){
        //     this.editCategoryForm.markAllAsTouched();
        //     const emptyFields = [];
        //     for (const controlName in this.editCategoryForm.controls) {
        //         if (this.editCategoryForm.controls.hasOwnProperty(controlName) && this.editCategoryForm.controls[controlName].errors?.['required']) {
        //             const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
        //             emptyFields.push(label);
        //         }
        //     }

        //     const errorData = {
        //         errorMessage: `Please fill in the following required fields: `,
        //         suberrorMessage: emptyFields.join(', ')
        //     };
        //     this.CategoryWarn.emit(errorData);
        // }
        
    }
    
    onCategoryDeleteSubmit(): void {
    
        let formData: any = new FormData();
        formData.append('id', this.selectedRowData.id);

        
        for (const value of formData.entries()) {
            console.log(`${value[0]}, ${value[1]}`);
        }
            // this.category_service.deleteCategory(this.selectedRowData.id).subscribe({
            //     next: async(response: any) => { 
                
            //         const successMessage = {
            //             head: 'Category Delete',
            //             sub: response?.message
            //         };
                    
            //         this.RefreshTable.emit();
                    
            //         this.refreshTableData();
            //         this.CategorySuccess.emit(successMessage);
            //         this.deleteCategoryForm.reset();
                    
            //         await this.asyncTask();
            //         this.CloseModal.emit();
            //     },
            //     error: (error: HttpErrorResponse) => {
            //         const customErrorMessages = {
            //             errorMessage: 'Invalid Request',
            //             suberrorMessage: 'There are subcategories under this category',
            //         };
                    
            //         const errorData = this.errorService.handleError(error, customErrorMessages);
            //         if (errorData.errorMessage === 'Unexpected Error') {
            //             this.CategoryError.emit(errorData);
            //         } else {
            //             this.CategoryWarn.emit(errorData);
            //         }
            //         return throwError(() => error); 
            //     }
            // });
            
    }

    
}
