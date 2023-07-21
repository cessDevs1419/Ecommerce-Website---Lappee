import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Observable, Subject, map, startWith, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastComponent } from '../../toast/toast.component';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { AdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { formatAdminCategories, formatAdminSubcategories } from 'src/app/utilities/response-utils';
import { GETCategories } from 'src/app/services/endpoints';
import { ErrorHandlingService } from 'src/app/services/errors/error-handling-service.service';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFormComponent {
    

    @Output() CategorySuccess: EventEmitter<any> = new EventEmitter();
    @Output() CategoryWarn: EventEmitter<any> = new EventEmitter();
	@Output() CategoryError: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();


    @Input() formAddCategory!: boolean;
    @Input() formEditCategory!: boolean;
    @Input() formDeleteCategory!: boolean;
    
    @Input() formAddSubCategory!: boolean;
    @Input() formEditSubCategory!: boolean;
    @Input() formDeleteSubCategory!: boolean;
    @Input() selectedRowData: any;
    @Input() refreshTable: any;
    
    addCategoryForm: FormGroup;
    editCategoryForm: FormGroup;
    deleteCategoryForm: FormGroup;
    
    addSubCategoryForm: FormGroup;
    editSubCategoryForm: FormGroup;
    deleteSubCategoryForm: FormGroup;

    categories!: Observable<AdminCategory[]>;
    sub_categories!: Observable<AdminSubcategory[]>;
    private refreshData$ = new Subject<void>();


    
    ngOnInit(): void {
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
    }
    
    constructor(
        private category_service: CategoriesService,
        private subcategory_service: SubcategoriesService,
        private formBuilder: FormBuilder,
        private errorService: ErrorHandlingService,
        private http: HttpClient
    ) 
    {
        this.addCategoryForm = new FormGroup({
            category: new FormControl('', Validators.required)
        });
        
        this.editCategoryForm = new FormGroup({
            //main_category_id: new FormControl('', Validators.required),
            category: new FormControl('', Validators.required)
        });
        
        this.deleteCategoryForm = new FormGroup({
            main_category_id: new FormControl('', Validators.required)
        });
        
        this.addSubCategoryForm = this.formBuilder.group({
            main_category: ['', Validators.required],
            sub_categories: this.formBuilder.array([])
        });
        
        this.editSubCategoryForm = this.formBuilder.group({
            sub_category: new FormControl('', Validators.required)
        });
        
        this.deleteSubCategoryForm = this.formBuilder.group({
            sub_category_id: new FormControl('', Validators.required)
        });
    }


    
    refreshTableData(): void {
        this.refreshData$.next();
    }
    
    //ADD SUB CATEGORY
    get subCategories(): FormArray {
        return this.addSubCategoryForm.get('sub_categories') as FormArray;
    }
    
    addSubCategory(): void {
        this.subCategories.push(this.formBuilder.control('', Validators.required));
    }
    
    removeSubCategory(index: number): void {
        this.subCategories.removeAt(index);
    }
    
    
    //Submit Functions
    onCategoryAddSubmit(): void {

        if(this.addCategoryForm.valid){

            
            let formData: any = new FormData();
            formData.append('name', this.addCategoryForm.get('category')?.value);
            
            this.category_service.postCategory(formData).subscribe({
                next: (response: any) => { 
                    this.RefreshTable.emit();
                    this.refreshTableData();
                    this.CategorySuccess.emit("Category "+this.addCategoryForm.value.category);
                    this.addCategoryForm.reset();

                },
                error: (error: HttpErrorResponse) => {
                    const errorData = this.errorService.handleError(error);
                    if (errorData.errorMessage === 'Unexpected Error') {
                        this.CategoryError.emit(errorData);
                    } else {
                        this.CategoryWarn.emit(errorData);
                    }
                    return throwError(() => error);
                    
                    // const customErrorMessages = {
                    //     errorMessage: 'Custom Error',
                    //     suberrorMessage: 'This is a custom error message.',
                    //   };
                    //   const errorData = this.errorService.handleError(error, customErrorMessages);
                }
            });
        
        
        }else{
            const emptyFields = [];
            for (const controlName in this.addCategoryForm.controls) {
                if (this.addCategoryForm.controls.hasOwnProperty(controlName) && this.addCategoryForm.controls[controlName].errors?.['required']) {
                    const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                    emptyFields.push(label);
                }
            }

            const errorData = {
                errorMessage: `Please fill in the following required fields: `,
                suberrorMessage: emptyFields.join(', ')
            };
            this.CategoryWarn.emit(errorData);
            // this.addCategoryForm.markAllAsTouched();
        }

    }

    onCategoryEditSubmit(): void {
        
        if(this.editCategoryForm.valid){

            let formData: any = new FormData();
            formData.append('id',  this.selectedRowData.id);
            formData.append('name', this.editCategoryForm.get('category')?.value);        

                
            this.category_service.patchCategory(formData).subscribe({
                next: (response: any) => { 
                    this.RefreshTable.emit();
                    this.refreshTableData();
                    this.CategorySuccess.emit("Category  "+this.editCategoryForm.value.category);
                    this.editCategoryForm.reset();
                },
                error: (error: HttpErrorResponse) => {
                    const errorData = this.errorService.handleError(error);
                    if (errorData.errorMessage === 'Unexpected Error') {
                        this.CategoryError.emit(errorData);
                    } else {
                        this.CategoryWarn.emit(errorData);
                    }
                    return throwError(() => error);
                }
            });
            
        }
            
        else if(this.editCategoryForm.invalid){
            this.editCategoryForm.markAllAsTouched();
            const emptyFields = [];
            for (const controlName in this.editCategoryForm.controls) {
                if (this.editCategoryForm.controls.hasOwnProperty(controlName) && this.editCategoryForm.controls[controlName].errors?.['required']) {
                    const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                    emptyFields.push(label);
                }
            }

            const errorData = {
                errorMessage: `Please fill in the following required fields: `,
                suberrorMessage: emptyFields.join(', ')
            };
            this.CategoryWarn.emit(errorData);
        }
        
    }
    
    onCategoryDeleteSubmit(): void {
            this.category_service.deleteCategory(this.selectedRowData.id).subscribe({
                next: (response: any) => { 
                    this.RefreshTable.emit();
                    this.refreshTableData();
                    this.CategorySuccess.emit("Category  "+this.selectedRowData.name);
                    this.deleteCategoryForm.reset();
                    
                },
                error: (error: HttpErrorResponse) => {
                    const customErrorMessages = {
                        errorMessage: 'Invalid Request',
                        suberrorMessage: 'There are subcategories under this category',
                    };
                    
                    const errorData = this.errorService.handleError(error, customErrorMessages);
                    if (errorData.errorMessage === 'Unexpected Error') {
                        this.CategoryError.emit(errorData);
                    } else {
                        this.CategoryWarn.emit(errorData);
                    }
                    return throwError(() => error); 
                }
            });
            
    }
    
    
    onSubCategoryAddSubmit(): void {

        if(this.addSubCategoryForm.valid){
    
            let formData: any = new FormData();
            formData.append('main_category_id', this.addSubCategoryForm.get('main_category')?.value);
            formData.append('name', this.addSubCategoryForm.get('sub_categories')?.value);
            
        this.subcategory_service.postSubcategory(formData).subscribe({
            next: (response: any) => { 
                this.RefreshTable.emit();
                this.refreshTableData();
                this.CategorySuccess.emit("sub_category "+this.addSubCategoryForm.value.name);
                this.editCategoryForm.reset();
                
                
            },
            error: (error: HttpErrorResponse) => {
                const errorData = this.errorService.handleError(error);
                if (errorData.errorMessage === 'Unexpected Error') {
                    this.CategoryError.emit(errorData);
                } else {
                    this.CategoryWarn.emit(errorData);
                }
                return throwError(() => error);
            }
        });
        
        }
        
        else if(this.addCategoryForm.invalid){
            this.addCategoryForm.markAllAsTouched();
        }
    
    
    }
    
    onSubCategoryEditSubmit(): void {
        
        if(this.editSubCategoryForm.valid){

            let formData: any = new FormData();
            formData.append('sub_category_id',  this.selectedRowData.id);
            formData.append('main_category_id', '');        
            formData.append('name', this.editSubCategoryForm.get('sub_category')?.value);        
                
            this.subcategory_service.patchSubcategory(formData).subscribe({
                next: (response: any) => { 
                    this.RefreshTable.emit();
                    this.refreshTableData();
                    this.CategorySuccess.emit("SubCategory  "+this.editSubCategoryForm.value.main_category);
                    this.editSubCategoryForm.reset();
                },
                error: (error: HttpErrorResponse) => {
                    const errorData = this.errorService.handleError(error);
                    if (errorData.errorMessage === 'Unexpected Error') {
                        this.CategoryError.emit(errorData);
                    } else {
                        this.CategoryWarn.emit(errorData);
                    }
                    return throwError(() => error);
                }
            });
            
        }
            
        else if(this.editSubCategoryForm.invalid){
            this.editSubCategoryForm.markAllAsTouched();
            const emptyFields = [];
            for (const controlName in this.editSubCategoryForm.controls) {
                if (this.editSubCategoryForm.controls.hasOwnProperty(controlName) && this.editSubCategoryForm.controls[controlName].errors?.['required']) {
                    const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                    emptyFields.push(label);
                }
            }

            const errorData = {
                errorMessage: `Please fill in the following required fields: `,
                suberrorMessage: emptyFields.join(', ')
            };
            this.CategoryError.emit(errorData);
        }
        
    }
    
    onSubCategoryDeleteSubmit(): void {
        this.subcategory_service.deleteSubcategory(this.selectedRowData.id).subscribe({
            next: (response: any) => { 
                console.log(response)
                this.RefreshTable.emit();
                this.refreshTableData();
                this.CategorySuccess.emit("SubCategory  "+this.selectedRowData.name);
                this.deleteSubCategoryForm.reset();
            },
            error: (error: HttpErrorResponse) => {
                const errorData = this.errorService.handleError(error);
                
                if (errorData.errorMessage === 'Invalid input') {
                    const errorMessage = {
                        errorMessage: 'Invalid Request',
                        suberrorMessage: 'There are products under this sub category! ',
                    }
                    this.CategoryWarn.emit(errorMessage);
                } else  if (errorData.errorMessage === 'Unprocessable Entity') {
                    this.CategoryWarn.emit(errorData);
                }else  if (errorData.errorMessage === 'Unexpected Error') {
                    this.CategoryError.emit(errorData);
                }else{
                
                }
                
                
                return throwError(() => error); 
            }
        });
        
    }
}
