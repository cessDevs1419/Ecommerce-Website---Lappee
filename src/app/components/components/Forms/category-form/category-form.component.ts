import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
    @Input() formAddCategory!: boolean;
    @Input() formAddSubCategory!: boolean;
    @Input() formEditCategory!: boolean;
    @Input() formDeleteCategory!: boolean;
    @Input() selectedRowData: any;

    
    addCategoryForm: FormGroup;
    addSubCategoryForm: FormGroup;
    EditCategoryForm: FormGroup;
    DeleteCategoryForm: FormGroup;

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
    onAddSubmit(): void {
        if (this.addCategoryForm.invalid) {
            return;
        }
        
        const newCategoryId = 'CAT' + (+ 1).toString();
        const newCategory = {
                id: newCategoryId,
                name: this.addCategoryForm.value.main_category,
        };

        console.log(newCategory);
        
        /*
        this.http.post('endpoint ni mark', newCategory).subscribe(
            (response) => {
              // Handle the success response from the server
                console.log('Category added successfully!', response);
            },
            (error) => {
              // Handle the error response from the server
                console.error('An error occurred while adding the category:', error);
            }
        );*/
    }
    
    
    onAddSubSubmit(): void {
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
    }
    

    onEditSubmit(): void {
    }
    
    onDeleteSubmit(): void {
    }
}
