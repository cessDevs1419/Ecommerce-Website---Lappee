import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { NewVariantList, Product, Variant } from 'src/assets/models/products';
import { DELETEVariantsAdmin, GETProductsVariants, GETSpecificVariant, PATCHVariantsAdmin, POSTVariantsAdmin } from '../endpoints';
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
			'Content-Type': 'image/*',
	        'Access-Control-Allow-Origin': '*',
	        'Access-Control-Allow-Credentials': 'true'
	      //galing kay dell
	    })
	};

	getImage(imageUrl: string): Observable<File> {
		return this.http.get(imageUrl, { ...this.httpOptions, responseType: 'arraybuffer' })
		  .pipe(map(response => this.convertToBlob(response)));
	}
	
	private convertToBlob(response: any): File {
		const blob = new Blob([response], { type: 'image/*' });
		const fileName = 'image.jpg'; // You can modify this based on the image type
		return new File([blob], fileName);
	}

	getIndex(){
	    return this.index
	}
	//ADD VARIANTS UPON ADD PRODUCT
    getVariants(): FormArray {
        return this.variantsList;
    }

	getProductVariants(id: string): Observable<any>{
		return this.http.get<NewVariantList>(GETProductsVariants+id);
	}

    addVariantToVariantsList(variantFormGroup: FormGroup): void {
       // console.log(variantFormGroup);
        this.variantsList.push(variantFormGroup);
    }
    
    //GET SET EDIT VARIANTS UPON ADD PRODUCT
	setVariantToEditForm(form: FormGroup, index: number) {
		this.editVariantData = { form, index };
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
					product.variants.forEach((variant) => {
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
									price: variant.price,
									stock: variant.stock,
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
	
	removeAdditional(index: number) {
		//this.DatabaseVariantList.push(variantFormGroup);
		this.AdditionvariantsList.removeAt(index)
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
			
		}
		this.DatabaseVariantList.removeAt(index);
			
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
	
	getImageFile(url: string): Observable<File> {
		return this.http.get(url, { responseType: 'blob' }).pipe(map((blob: Blob) => {
		  const fileName = this.getFileNameFromUrl(url);
		  return new File([blob], fileName, { type: blob.type });
		}));
	  }
	
	private getFileNameFromUrl(url: string): string {
		// Extract the file name from the URL
		const matches = url.match(/\/([^\/?#]+)[^\/]*$/);
		if (matches && matches.length > 1) {
		  return matches[1];
		}
		// If unable to extract, generate a random name
		return 'image_' + Date.now();
	}
	
	
	getSpecificVariants(id: string): Observable<any> {
		return this.http.get<NewVariantList>(GETSpecificVariant+id);
	}
	//Database Request
	postVariants(data: FormData): Observable<any> {
		return this.http.post<Product>(POSTVariantsAdmin, data, this.httpOptions);
	} 
	
	
	patchVariants(data: FormData): Observable<any> {
		return this.http.post<Product>(PATCHVariantsAdmin, data, this.httpOptions);
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
