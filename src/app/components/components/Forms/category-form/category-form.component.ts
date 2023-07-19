import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Observable, map, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastComponent } from '../../toast/toast.component';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { AdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { formatAdminCategories, formatAdminSubcategories } from 'src/app/utilities/response-utils';
import { GETCategories } from 'src/app/services/endpoints';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFormComponent {

    @Output() CategorySuccess: EventEmitter<any> = new EventEmitter();
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


    
    ngOnInit(): void {
        this.categories = this.category_service.getAdminCategories().pipe(map((Response: any) => formatAdminCategories(Response)));
        this.sub_categories = this.subcategory_service.getAdminSubcategories().pipe(map((Response: any) => formatAdminSubcategories(Response)));
    }
    
    constructor(
        private category_service: CategoriesService,
        private subcategory_service: SubcategoriesService,
        private formBuilder: FormBuilder,
        private http: HttpClient
    ) 
    {
        this.addCategoryForm = new FormGroup({
            main_category: new FormControl('', Validators.required)
        });
        
        this.editCategoryForm = new FormGroup({
            //main_category_id: new FormControl('', Validators.required),
            main_category: new FormControl('', Validators.required)
        });
        
        this.deleteCategoryForm = new FormGroup({
            main_category_id: new FormControl('', Validators.required)
        });
        
        this.addSubCategoryForm = this.formBuilder.group({
            main_category: ['', Validators.required],
            subCategories: this.formBuilder.array([])
        });
        
        this.editSubCategoryForm = this.formBuilder.group({
            sub_category: new FormControl('', Validators.required)
        });
        
        this.deleteSubCategoryForm = this.formBuilder.group({
            sub_category_id: new FormControl('', Validators.required)
        });
    }


    //ADD SUB CATEGORY
    
    get subCategories(): FormArray {
        return this.addSubCategoryForm.get('subCategories') as FormArray;
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
            formData.append('name', this.addCategoryForm.get('main_category')?.value);
            
            this.category_service.postCategory(formData).subscribe({
                next: (response: any) => { 
                    this.RefreshTable.emit();
                    this.CategorySuccess.emit("Category "+this.addCategoryForm.value.main_category);
                    this.addCategoryForm.reset();

                    
                },
                error: (error: HttpErrorResponse) => {
                    return throwError(() => error)
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
            this.CategoryError.emit(errorData);
            // this.addCategoryForm.markAllAsTouched();
        }

    }

    onCategoryEditSubmit(): void {
        
        if(this.editCategoryForm.valid){

            let formData: any = new FormData();
            formData.append('id',  this.selectedRowData.id);
            formData.append('name', this.editCategoryForm.get('main_category')?.value);        

                
            this.category_service.patchCategory(formData).subscribe({
                next: (response: any) => { 
                    this.RefreshTable.emit();
                    this.CategorySuccess.emit("Category  "+this.editCategoryForm.value.main_category);
                    this.editCategoryForm.reset();
                },
                error: (error: HttpErrorResponse) => {
                    return throwError(() => error)
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
            this.CategoryError.emit(errorData);
        }
        
    }
    
    onCategoryDeleteSubmit(): void {
            this.category_service.deleteCategory(this.selectedRowData.id).subscribe({
                next: (response: any) => { 
                    this.RefreshTable.emit();
                    this.CategorySuccess.emit("Category  "+this.selectedRowData.name);
                    this.deleteCategoryForm.reset();
                },
                error: (error: HttpErrorResponse) => {
                
                    const errorData = {
                        errorMessage: `Invalid Item`,
                        suberrorMessage: 'Category has a sub-category'
                    };
                    
                    this.CategoryError.emit(errorData);
                    
                }
            });
            
    }
    
    
    onSubCategoryAddSubmit(): void {

        if(this.addSubCategoryForm.valid){
            // submit
            console.warn(this.addSubCategoryForm.value);
    
            let formData: any = new FormData();
            formData.append('name', this.addSubCategoryForm.get('main_category_id')?.value);
            formData.append('name', this.addSubCategoryForm.get('main_category')?.value);

    
            for(const value of formData.entries()){
                console.log(`${value[0]}, ${value[1]}`);
            }
            
        this.category_service.postCategory(formData).subscribe({
            next: (response: any) => { 
                console.log(response);
                this.addCategoryForm.reset();
                this.CategorySuccess.emit("Category "+this.addCategoryForm.value.main_category);
            },
            error: (error: HttpErrorResponse) => {
                return throwError(() => error)
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
    
            for(const value of formData.entries()){
                console.log(`${value[0]}, ${value[1]}`);
            }
                
            this.subcategory_service.patchSubcategory(formData).subscribe({
                next: (response: any) => { 
                    this.RefreshTable.emit();
                    this.CategorySuccess.emit("Category  "+this.editSubCategoryForm.value.main_category);
                    this.editSubCategoryForm.reset();
                },
                error: (error: HttpErrorResponse) => {
                    return throwError(() => error)
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
                this.CategorySuccess.emit("Category  "+this.selectedRowData.name);
                this.deleteSubCategoryForm.reset();
            },
            error: (error: HttpErrorResponse) => {
                return throwError(() => error)
            }
        });
        
    }
}
