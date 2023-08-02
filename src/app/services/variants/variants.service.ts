import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Variant } from 'src/assets/models/products';
import { DELETEVariantsAdmin, PATCHVariantsAdmin } from '../endpoints';


@Injectable({
    providedIn: 'root'
})

export class VariantsService {
	private index: number;
	private variantsList: FormArray = this.formBuilder.array([]);
	private editVariantData: { form: FormGroup, index: number } | null = null;
	constructor(
	    private http: HttpClient,
	    private formBuilder: FormBuilder) {
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
    
    //EDIT VARIANTS UPON ADD PRODUCT
	setVariantToEditForm(form: FormGroup, index: number) {
		this.editVariantData = { form, index };
		console.log(this.editVariantData)
	}
	
	getVariantFromEditForm(): { form: FormGroup, index: number } | null {
		return this.editVariantData;
	}
	
}
