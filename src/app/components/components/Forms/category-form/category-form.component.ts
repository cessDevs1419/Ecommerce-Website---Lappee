import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Observable, map, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastComponent } from '../../toast/toast.component';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories/subcategories.service';
import { AdminCategory } from 'src/assets/models/categories';
import { AdminSubcategory } from 'src/assets/models/subcategories';
import { formatAdminCategories, formatAdminSubcategories } from 'src/app/utilities/response-utils';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent {

    @Output() CategorySuccess: EventEmitter<any> = new EventEmitter();
	@Output() CategoryError: EventEmitter<any> = new EventEmitter();



    @Input() formAddCategory!: boolean;
    @Input() formAddSubCategory!: boolean;
    @Input() formEditCategory!: boolean;
    @Input() formDeleteCategory!: boolean;
    @Input() selectedRowData: any;

    addCategoryForm: FormGroup;
    addSubCategoryForm: FormGroup;
    editCategoryForm: FormGroup;
    deleteCategoryForm: FormGroup;

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
        
        this.addSubCategoryForm = this.formBuilder.group({
            main_category: ['', Validators.required],
            subCategories: this.formBuilder.array([])
        });
        
        this.editCategoryForm = new FormGroup({
            // main_category_id: new FormControl('', Validators.required),
            main_category: new FormControl('', Validators.required)
        });
        
        this.deleteCategoryForm = new FormGroup({
            main_category_id: new FormControl('', Validators.required)
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
            const newCategoryId = 'CAT' + (+ 1).toString();
            const newCategory = {
                    id: newCategoryId,
                    name: this.addCategoryForm.value.main_category,
            };
    
            
            this.CategorySuccess.emit("Category "+this.addCategoryForm.value.main_category);
            this.addCategoryForm.reset();
            // let formData: any = new FormData();
            // formData.append('id',  newCategoryId);
            // formData.append('name', this.addCategoryForm.get('main_category')?.value);

    
            // for(const value of formData.entries()){
            //     console.log(`${value[0]}, ${value[1]}`);
            // }
            
            // this.category_service.postCategory(formData).subscribe({
            //     next: (response: any) => { 
            //         console.log(response);
            //         this.CategorySuccess.emit("Category "+this.addCategoryForm.value.main_category);
            //         this.addCategoryForm.reset();
            //     },
            //     error: (error: HttpErrorResponse) => {
            //         return throwError(() => error)
            //     }
            // });
        
        
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
    
    onSubCategoryAddSubmit(): void {
        if (this.addSubCategoryForm.invalid) {
            return;
        }
        const newSubCategoryId = 'SUBCAT' + (this.subCategories.length + 1).toString();
        const newSubCategory = {
            id: newSubCategoryId,
            name: '',
            main_category_id: this.addSubCategoryForm.value.main_category,
        };
    
        this.subCategories.controls.forEach((control: any, index: number) => {
            const subCategoryName = control.value;
            newSubCategory.name = subCategoryName;
        });
    
        console.log(newSubCategory);
        
        /*
            if(this.addCategoryForm.valid){
                // submit
                console.warn(this.addCategoryForm.value);
        
                let formData: any = new FormData();
                formData.append('id',  newCategoryId);
                formData.append('name', this.addCategoryForm.get('main_category')?.value);
    
        
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
        */
        
    }
    

    onCategoryEditSubmit(): void {
        
        if(this.editCategoryForm.valid){
            const editCategory = {
                name: this.editCategoryForm.value.main_category,
            };
            console.log(editCategory);
            this.CategorySuccess.emit("Category  "+this.editCategoryForm.value.main_category);
            
            // let formData: any = new FormData();
            // formData.append('id',  this.selectedRowData.id);
            // formData.append('name', this.editCategoryForm.get('main_category')?.value);        
    
            // for(const value of formData.entries()){
            //     console.log(`${value[0]}, ${value[1]}`);
            // }
                
            // this.category_service.patchCategory(formData).subscribe({
            //     next: (response: any) => { 
            //         console.log(response);
            //         this.editCategoryForm.reset();
            //         this.CategorySuccess.emit("Category  "+this.editCategoryForm.value.main_category);
            //     },
            //     error: (error: HttpErrorResponse) => {
            //         return throwError(() => error)
            //     }
            // });
            
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
        
        const deleteCategory = {
            id: this.deleteCategoryForm.value.main_category_id || this.selectedRowData?.id,
        };
        console.log(deleteCategory);
        this.CategorySuccess.emit("Category  "+this.selectedRowData?.name);
            
            // let formData: any = new FormData();
            // formData.append('id',  this.selectedRowData.id);

    
            // for(const value of formData.entries()){
            //     console.log(`${value[0]}, ${value[1]}`);
            // }
            
            // this.category_service.deleteCategory(formData).subscribe({
            //     next: (response: any) => { 
            //         console.log(response);
            //         this.deleteCategoryForm.reset();
            //         this.CategorySuccess.emit("Category  "+this.deleteCategoryForm.value.main_category);
            //     },
            //     error: (error: HttpErrorResponse) => {
            //         return throwError(() => error)
            //     }
            // });
    }
}
