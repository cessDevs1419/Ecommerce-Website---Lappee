import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, catchError, map, throwError } from 'rxjs';
import { AttributesService } from 'src/app/services/attributes/attributes.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { AttributesDetails } from 'src/assets/models/attributes';

@Component({
    selector: 'app-attribute-form',
    templateUrl: './attribute-form.component.html',
    styleUrls: ['./attribute-form.component.css'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AttributeFormComponent {
	@Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
    @Output() ProductWarning: EventEmitter<any> = new EventEmitter();
    @Output() CloseModal: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();
    @Output() hideMinus: EventEmitter<void> = new EventEmitter();

    @Input() selectedRowData: any;
    @Input() selectedRowDataForDelete: any[] = [];
    @Input() formAddAttribute!: boolean;
    @Input() formEditAttribute!: boolean;
    @Input() formDeleteAttribute!: boolean;
    @Input() formMultipleDeleteAttribute!: boolean;
    @Input() attributeDetails: any[] = []
    
    textcolor: string = 'text-light-subtle'
    bordercolor: string = 'dark-subtle-borders'
    addAttributeForm: FormGroup;
    editAttributeForm: FormGroup;
    deleteAttributeForm: FormGroup;
  
    attributesValues: string[] = [];
    newSelectedRowDataForDelete: any
    private refreshData$ = new Subject<void>();
    
    constructor(
        private attribute_service: AttributesService,
        private formBuilder: FormBuilder,
        private errorService: ErrorHandlerService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ){
        this.addAttributeForm = new FormGroup({
            name: new FormControl('', Validators.required),
            attribute_value: this.formBuilder.array([])
        });
        this.editAttributeForm = new FormGroup({
            name: new FormControl('', Validators.required),
            attribute_value: this.formBuilder.array([])
        });

        // this.deleteAttributeForm = new FormGroup({
        //     id: new FormArray[]
        // });

    }
    
    ngOnInit() {
        this.addAttributeForm = new FormGroup({
            name: new FormControl('', Validators.required),
            attribute_value: this.formBuilder.array([])
        });

    }

    refreshTableData(): void {
        this.refreshData$.next();
    }
    



    addAttributeValue(){
        const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray
        attributeArray.push(new FormControl(''));
    }   

    addExistingAttributeName(name: string){
        this.addAttributeForm.get('name')?.setValue(name)
        console.log(name)
    }   

    addExistingAttributeValue(value: any[]) {
        
        this.ngZone.run(() => {
            const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray;
            attributeArray.clear();
            
            
            for (const item of value) {
              attributeArray.push(this.formBuilder.control(item));
            }
        
            console.log(attributeArray.value);
            this.cdr.detectChanges();
        });
    }

    get attributeValueControls() {
        return (this.addAttributeForm.get('attribute_value') as FormArray).controls;
    }

    reset(){
        const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray;
        attributeArray.clear()
    }

    removeAttributeValue(index: number) {
        const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray;
        attributeArray.removeAt(index);
    }

    removeExistingAttributeValue(index: number) {
        const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray;
        attributeArray.removeAt(index)
    }

    onAttributeAddSubmit(): void {
        if(this.addAttributeForm.valid){

            const nameValue = this.addAttributeForm.get('name')?.value; 
            const capitalizedName = nameValue.charAt(0).toUpperCase() + nameValue.slice(1);
           
            const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray;

            let formData: FormData = new FormData(); 
            formData.append('name', capitalizedName);
        
            
            for (let val of attributeArray.value) {
                let index = 0;
                const capitalizedAttributeValue = val.charAt(0).toUpperCase() + val.slice(1);
                formData.append('values[]', capitalizedAttributeValue);
                index++;
            }

            // formData.forEach((value, key) => {
            //     console.log(`${key}: ${value}`);
            // });
            
            this.attribute_service.postAttribute(formData).subscribe({
                next: (response: any) => { 
                    const successMessage = {
                        head: 'Attribute ' + this.addAttributeForm.get('name')?.value,
                        sub: response?.message
                    };
                    
                    this.RefreshTable.emit();
                    this.refreshTableData();
                    this.ProductSuccess.emit(successMessage);
                    this.addAttributeForm.reset();
                    attributeArray.reset();
                    attributeArray.clear();
                    this.CloseModal.emit();

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
        
            
        }else{
            this.addAttributeForm.markAllAsTouched();
            const emptyFields = [];
            for (const controlName in this.addAttributeForm.controls) {
                if (this.addAttributeForm.controls.hasOwnProperty(controlName) && this.addAttributeForm.controls[controlName].errors?.['required']) {
                    const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                    emptyFields.push(label);
                }
            }

            const errorData = {
                head: `Please fill in the following required fields: `,
                sub: emptyFields.join(', ')
            };
            this.ProductWarning.emit(errorData);
            
        }

    }
    
    onAttributeEditSubmit(): void {

        const nameValue = this.addAttributeForm.get('name')?.value; 
        const capitalizedName = nameValue.charAt(0).toUpperCase() + nameValue.slice(1);
       
        const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray;
        const attributeExisting = this.attributeDetails;

        let formData: FormData = new FormData(); 
        formData.append('id', this.selectedRowData.id);
        formData.append('name', capitalizedName);
        
        for (let val of attributeArray.value) {
            let index = 0;
            const capitalizedAttributeValue = val.charAt(0).toUpperCase() + val.slice(1);
            formData.append('values[]', capitalizedAttributeValue);
            index++;
        }

        for (let val of attributeExisting) {
            let index = 0;
            const capitalizedAttributeValue = val.charAt(0).toUpperCase() + val.slice(1);
            formData.append('values[]', capitalizedAttributeValue);
            index++;
        }

        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        
        // this.attribute_service.postAttribute(formData).subscribe({
        //     next: (response: any) => { 
        //         const successMessage = {
        //             head: 'Attribute ' + this.addAttributeForm.get('name')?.value,
        //             sub: response?.message
        //         };
                
        //         this.RefreshTable.emit();
        //         this.refreshTableData();
        //         this.ProductSuccess.emit(successMessage);
        //         this.addAttributeForm.reset();
        //         attributeArray.clear();
        //         this.CloseModal.emit();
        //     },
        //     error: (error: HttpErrorResponse) => {
        //         if (error.error?.data?.error) {
        //             const fieldErrors = error.error.data.error;
        //             const errorsArray = [];
                
        //             for (const field in fieldErrors) {
        //                 if (fieldErrors.hasOwnProperty(field)) {
        //                     const messages = fieldErrors[field];
        //                     let errorMessage = messages;
        //                     if (Array.isArray(messages)) {
        //                         errorMessage = messages.join(' '); // Concatenate error messages into a single string
        //                     }
        //                     errorsArray.push(errorMessage);
        //                 }
        //             }
                
        //             const errorDataforProduct = {
        //                 head: 'Error Invalid Inputs',
        //                 sub: errorsArray,
        //             };
                
        //             this.ProductWarning.emit(errorDataforProduct);
        //         } else {
                
        //             const errorDataforProduct = {
        //                 head: 'Error Invalid Inputs',
        //                 sub: 'Please Try Another One',
        //             };
        //             this.ProductError.emit(errorDataforProduct);
        //         }
                
        //         return throwError(() => error);
                
        //     }
        // });
    

    }
    
    onAttributeDeleteSubmit(): void {
            let formData: any = new FormData();
            const selectedId: any[] = []
            if(this.selectedRowData){
                selectedId.push(this.selectedRowData.id)
            }else{

                for(let id of this.selectedRowDataForDelete){
                    selectedId.push(id)
                }
                
            }

            // for (const value of formData.entries()) {
            //     console.log(`${value[0]}, ${value[1]}`);
            // }

            this.attribute_service.deleteAttributes(selectedId).subscribe({
                next: (response: any) => { 
                    const successMessage = {
                        head: 'Delete Attribute ',
                        sub: response?.message
                    };
                    this.CloseModal.emit();
                    this.RefreshTable.emit();
                    this.refreshTableData();
                    this.hideMinus.emit()
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
    
}
