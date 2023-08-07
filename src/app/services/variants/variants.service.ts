import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { Product, Variant } from 'src/assets/models/products';
import { DELETEVariantsAdmin, PATCHVariantsAdmin, POSTVariantsAdmin } from '../endpoints';
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
	private id: any;

	
	
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
					const newVariants: FormGroup[] = [];
					product.product_variants.forEach((variant) => {
						// Check if the variant already exists in the DatabaseVariantList
						const variantExists = this.DatabaseVariantList.controls.some(
							(control) =>
								control.get('variant_id')?.value === variant.variant_id
						);
						
						const variantIdArray = this.variantId.controls.map(control => control.value);
						
						if (variant.product_id === this.id) {
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
				
								newVariants.push(variantGroup);
							}
						}
					});
	
					// Remove variants from DatabaseVariantList that do not match the current product_id
					const controls = this.DatabaseVariantList.controls;
					for (let i = controls.length - 1; i >= 0; i--) {
						const control = controls[i];
						if (control.get('product_id')?.value !== this.id) {
							this.DatabaseVariantList.removeAt(i);
						}
					}
	
					// Push the new variants into DatabaseVariantList
					newVariants.forEach(variantGroup => {
						this.DatabaseVariantList.push(variantGroup);
					});
				}
			});
		});
	
	}
	
	setDatabaseVariant(id: any) {
		this.id = id
	}
	
	getDatabaseVariant(): FormArray {
		return this.DatabaseVariantList;
	}
	
	getAdditionVariant(): FormArray {
		return this.AdditionvariantsList;
	}
	
	getEditedVariant(): FormArray {
		const editedVariants = this.EditedvariantsList.controls.filter((control, index) => {
			const variantIdValue = control.get('variant_id')?.value;
			const variantIdExists = this.variantId.controls.some(idControl =>
				idControl.value === variantIdValue
			);
			if (!variantIdExists) {
				return true; // Keep the control
			} else {
				this.EditedvariantsList.removeAt(index); // Remove the control
				return false; // Exclude from the filtered list
			}
		});
		return this.formBuilder.array(editedVariants);
	}
	
	getDeletedVariant(): FormArray {
		return this.variantId;
	}
	
	
	addtoDatabaseVariant(variantFormGroup: FormGroup) {
		//this.DatabaseVariantList.push(variantFormGroup);
		this.AdditionvariantsList.push(variantFormGroup);
	}
	
	async editfromDatabaseVariant(form: FormGroup, index: number) {
		if (index !== undefined && index >= 0 && index < this.DatabaseVariantList.length) {
			this.DatabaseVariantList.at(index).patchValue(form.value);
		}
		
		const editedIndex = this.EditedvariantsList.controls.findIndex(control =>
			control.value.variant_id === form.value.variant_id
		);
		
		if (editedIndex !== -1) {
			this.EditedvariantsList.removeAt(editedIndex);
			this.EditedvariantsList.push(form);

		} else {
			this.EditedvariantsList.push(form);

		}
		
	}
	
	deletefromDatabaseVariant(id: any, index: number) {
		if (index >= 0 && index < this.DatabaseVariantList.length) {
			this.DatabaseVariantList.removeAt(index);
			this.EditedvariantsList.removeAt(index);
			
			if (id) {
				this.variantId.push(this.formBuilder.control(id));
				const variantIdValue = id; // Assuming id is the variant_id
				const editedVariantIndex = this.EditedvariantsList.controls.findIndex(control =>
					control.get('variant_id')?.value === variantIdValue
				);
				
				if (editedVariantIndex !== -1) {
					this.EditedvariantsList.removeAt(editedVariantIndex);
				}
			}
		}
	}
	

	//Database Request
	postVariants(data: FormData): Observable<any> {
		return this.http.post<Product>(POSTVariantsAdmin, data, this.httpOptions);
	} 
	
	
	patchVariants(data: FormData): Observable<any> {
		return this.http.patch<Product>(PATCHVariantsAdmin, data, this.httpOptions);
	} 
	
	
	deleteVariants(varId: string): Observable<any> {
		return this.http.delete(DELETEVariantsAdmin, {
		    headers: new HttpHeaders({
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': 'true'
		    }),
		    responseType: 'json',
		    body: varId
		})
	}

}
