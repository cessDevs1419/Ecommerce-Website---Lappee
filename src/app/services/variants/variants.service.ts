import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { Product, Variant } from 'src/assets/models/products';
import { DELETEVariantsAdmin, PATCHVariantsAdmin } from '../endpoints';
import { ProductsService } from '../products/products.service';
import { formatProducts } from 'src/app/utilities/response-utils';

@Injectable({
    providedIn: 'root'
})

export class VariantsService {
	private index: number;
	private variantsList: FormArray = this.formBuilder.array([]);
	private editVariantData: { form: FormGroup, index: number } | null = null;
	private products: Observable<Product[]>;
	private DatabaseVariantList: FormArray = this.formBuilder.array([]);
	private AdditionvariantsList: FormArray = this.formBuilder.array([]);
	private EditedvariantsList: FormArray = this.formBuilder.array([]);
	private variantId: FormArray = this.formBuilder.array([]);
	private id: string;
	
	constructor(
	    private http: HttpClient,
	    private formBuilder: FormBuilder,
	    private product_service: ProductsService
	    
	    ) {
	}
	
	ngOnInit(): void{

	}

	httpOptions = {
	    headers: new HttpHeaders({
	        'Accept': 'application/json',
	        'Access-Control-Allow-Origin': '*',
	        'Access-Control-Allow-Credentials': 'true'
	      //galing kay dell
	    })
	};

	getIndex(){
	    return this.index
	}
	//ADD VARIANTS UPON ADD PRODUCT
    getVariants(): FormArray {
        return this.variantsList;
    }

    addVariantToVariantsList(variantFormGroup: FormGroup): void {
        this.variantsList.push(variantFormGroup);
        console.log(this.variantsList)
    }
    
    //GET SET EDIT VARIANTS UPON ADD PRODUCT
	setVariantToEditForm(form: FormGroup, index: number) {
		this.editVariantData = { form, index };
		console.log(this.editVariantData)
	}
	
	getVariantFromEditForm(): { form: FormGroup, index: number } | null {
		return this.editVariantData;
	}
	
	
	//GET AND SELECT VARIANTS FROM SELECTED PRODUCT
	
	loadVariants(): void {  
	
		this.product_service
		.getAdminProducts()
		.pipe(map((Response: any) => formatProducts(Response)))
		.subscribe((productArray: Product[]) => {
			productArray.forEach((product) => {
				if (product.id === this.id) {
					product.product_variants.forEach((variant) => {
						// Check if the variant already exists in the DatabaseVariantList
						const variantExists = this.DatabaseVariantList.controls.some(
						(control) =>
							control.get('variant_id')?.value === variant.variant_id
						);
						const variantIdArray = this.variantId.controls.map(control => control.value);
						
						if (!variantExists && !variantIdArray.includes(variant.variant_id)) {
							const variantGroup = this.formBuilder.group({
								variant_id: variant.variant_id,
								product_id: variant.product_id,
								size: variant.size,
								price: variant.price,
								stock: variant.stock,
								stock_limit: variant.stock_limit,
								color: variant.color,
								color_title: variant.color_title,
							});
			
						    this.DatabaseVariantList.push(variantGroup);
						}
					});
				}
			});
		});
	}
	
	setDatabaseVariant(id: string) {
		this.id = id
	}
	
	getDatabaseVariant(): FormArray {
		return this.DatabaseVariantList;
	}
	
	getAdditionVariant(): FormArray {
		return this.AdditionvariantsList;
	}
	
	getEditedVariant(): FormArray {
		return this.EditedvariantsList;
	}
	
	getDeletedVariant(): FormArray {
		return this.variantId;
	}
	
	
	addtoDatabaseVariant(variantFormGroup: FormGroup) {
		this.DatabaseVariantList.push(variantFormGroup);
		this.AdditionvariantsList.push(variantFormGroup);
		console.log(this.DatabaseVariantList)
	}
	
	editfromDatabaseVariant(form: FormGroup, index: number) {
		if (index !== undefined && index >= 0 && index < this.DatabaseVariantList.length) {
			this.DatabaseVariantList.at(index).patchValue(form.value);
			this.EditedvariantsList.push(form);
		}
		
		console.log(form, index)
		console.log(this.DatabaseVariantList)
	}
	
	deletefromDatabaseVariant(id: any, index: number) {
		if (index >= 0 && index < this.DatabaseVariantList.length) {
            this.DatabaseVariantList.removeAt(index);
            
            if (id) {
                this.variantId.push(this.formBuilder.control(id));
                console.log(this.variantId)
            }
            
        }
	}
	

}
