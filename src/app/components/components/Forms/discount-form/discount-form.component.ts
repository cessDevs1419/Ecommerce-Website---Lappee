import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, map, startWith, switchMap, throwError } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { DiscountsService } from 'src/app/services/discounts/discounts.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { formatAdminCategories, formatAdminProducts } from 'src/app/utilities/response-utils';
import { AdminCategory } from 'src/assets/models/categories';
import { AdminProduct } from 'src/assets/models/products';

@Component({
    selector: 'app-discount-form',
    templateUrl: './discount-form.component.html',
    styleUrls: ['./discount-form.component.css']
})
export class DiscountFormComponent {
	@Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
	@Output() ProductWarning: EventEmitter<any> = new EventEmitter();
    @Output() Select: EventEmitter<any> = new EventEmitter();

    @ViewChild('date1') date1: ElementRef;
    @ViewChild('date2') date2: ElementRef;

	productSuccessMessage = 'Product: ';
	errorMessage = 'Please fill in all the required fields.';
    inputColor: string = "text-white"
    borderColor: string = "border-grey"
    textcolor: string = 'text-light-subtle'
    bordercolor: string = 'dark-subtle-borders'
    titleColor : string = 'dark-theme-text-color';
	itemColor: string = 'text-white-50';
    selectedReason: string = '';

    @Input() selectedRowData: any;
    @Input() formAddDiscount!: boolean;
    @Input() formEditDiscount!: boolean;
    @Input() formDeleteDiscount!: boolean;
    
    from: string = 'Select Date From';
    to: string = 'Select Date To'; 
    addDiscountForm: FormGroup;
	editDiscountForm: FormGroup;
	deleteDiscountForm: FormGroup;
    formProductSelect: boolean = false;
	selectedItemsPerGroup: { id: any; value: string }[] = [];
    categories!: Observable<AdminCategory[]>;
    private refreshData$ = new Subject<void>();
    selectedItems: any
    products!: Observable<AdminProduct[]>;
    
    constructor(
        private category_service: CategoriesService,
        private discounts: DiscountsService,
        private service: ProductsService,
        ){
        this.addDiscountForm = new FormGroup({
            type: new FormControl('', Validators.required),
            value: new FormControl('', Validators.required),
            duration_from: new FormControl('', Validators.required),
            duration_to: new FormControl('', Validators.required),
        });
    }

    ngOnInit(): void{
		this.products = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.service.getAdminProducts()),
            map((Response: any) => formatAdminProducts(Response))  
        );
    }
    
    refreshTableData(): void {
        this.refreshData$.next();
    }


    selectFromDate(){
		this.date1.nativeElement.showPicker()
	}

    selectToDate(){
		this.date2.nativeElement.showPicker()
	}

	getDateFromValue(event: any) {
		const date = event.target.value;
        this.from = date
	}

    getDateToValue(event: any) {
		const date = event.target.value;
        this.to = date
	}

    selectProducts(){
        this.formProductSelect = true
        this.Select.emit(true)
    }

    backtoconfirm(){
        // this.formConfirm = true
        this.formProductSelect = false
        this.Select.emit(false)
    }

    setProductGroup(items: any) {
        this.selectedItems = items
    }
    
    onDiscountAddSubmit(): void {
        
        if(this.addDiscountForm.valid){
           this.selectProducts();
        }else{
            const errorDataforProduct = {
                head: 'Discount Management',
                sub: 'Please Fill Up Every Forms',
            };
        
            this.ProductError.emit(errorDataforProduct);
        }
    }

    addDiscountSubmit(){
        console.log(this.selectedItems)
            let formData: FormData = new FormData(); 
            formData.append('type', this.addDiscountForm.get('type')?.value);
            formData.append('value', this.addDiscountForm.get('value')?.value.toFixed(2));
            formData.append('starts_on', this.addDiscountForm.get('duration_from')?.value);
            formData.append('expires_on', this.addDiscountForm.get('duration_to')?.value);
            formData.append('products[]', this.selectedItems);
        
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });
            
            this.discounts.postDiscount(formData).subscribe({
                next: (response: any) => { 
                    const successMessage = {
                        head: 'Discount Management',
                        sub: response?.message
                    };
                    

                    this.refreshTableData();
                   
                    this.ProductSuccess.emit(successMessage);
                },
                error: (error: HttpErrorResponse) => {
                    if (error.error?.data?.error) {
                        const fieldErrors = error.error.data.error;
                        const errorsArray = [];
                    
                        for (const field in fieldErrors) {
                            if (fieldErrors.hasOwnProperty(field)) {
                                const messages = fieldErrors[field];
                                let errorMessage = messages;
                                if (Array.isArray(messages)) {
                                    errorMessage = messages.join(' '); // Concatenate error messages into a single string
                                }
                                errorsArray.push(errorMessage);
                            }
                        }
                    
                        const errorDataforProduct = {
                            head: 'Error Invalid Inputs',
                            sub: errorsArray,
                        };
                    
                        this.ProductWarning.emit(errorDataforProduct);
                    } else {
                    
                        const errorDataforProduct = {
                            head: 'Error Invalid Inputs',
                            sub: 'Please Try Another One',
                        };
                        this.ProductError.emit(errorDataforProduct);
                    }
                    
                    return throwError(() => error);
                    
                }
            });

    }
    onDiscountEditSubmit(): void {

        
    }
    
    onDiscountDeleteSubmit(): void {

        
    }
}
