import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable, map } from 'rxjs';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CategoryList, Subcategory } from 'src/assets/models/categories';
import { formatSubcategories } from 'src/app/utilities/response-utils';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent {
    @Input() formAddCategory!: boolean;
    @Input() formEditCategory!: boolean;
    @Input() formDeleteCategory!: boolean;
    @Input() selectedRowData: any;

    addcategory: FormGroup;
    editcategory: FormGroup;
    deletecategory: FormGroup;
    
    addCategoryForm: FormGroup;

    sub_categories!: Observable<Subcategory[]>;

    ngOnInit(): void {
        this.sub_categories = this.category_service.getCategories().pipe(
            map((Response: any) => formatSubcategories(Response))
        );
    }
    
    constructor(
        private category_service: CategoriesService,
        private formBuilder: FormBuilder
    ) 
    {
        this.addCategoryForm = this.formBuilder.group({
            categoryName: ['', Validators.required],
            subCategories: this.formBuilder.array([]),
        });
        
    }
    get subCategories(): FormArray {
        return this.addCategoryForm.get('subCategories') as FormArray;
    }

    addSubCategory(): void {
        this.subCategories.push(this.formBuilder.control('', Validators.required));
    } 
    
    removeSubCategory(index: number): void {
        this.subCategories.removeAt(index);
    }

    //SUBMIT
    onAddSubmit(): void {
        if (this.addCategoryForm.invalid) {
              // Handle form validation errors
                return;
            }
            const newCategoryId = 'CAT' + (+ 1).toString();
            const newCategory = {
                id: newCategoryId,
                name: this.addCategoryForm.value.categoryName,
                sub_categories: this.addCategoryForm.value.subCategories.map((subCategoryName: string, index: number) => {
                return {
                    id: 'SUBCAT' + (index + 1).toString(),
                    main_category_id: newCategoryId,
                    name: subCategoryName,
                };
            }),
        };
    
        console.log(newCategory);
    }
    
    

    onEditSubmit(): void {
    }
    
    onDeleteSubmit(): void {
    }
}
