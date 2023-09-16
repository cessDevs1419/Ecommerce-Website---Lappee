import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, throwError } from 'rxjs';
import { AttributesService } from 'src/app/services/attributes/attributes.service';

@Component({
    selector: 'app-attribute-form',
    templateUrl: './attribute-form.component.html',
    styleUrls: ['./attribute-form.component.css']
})
export class AttributeFormComponent {
	@Output() ProductSuccess: EventEmitter<any> = new EventEmitter();
	@Output() ProductError: EventEmitter<any> = new EventEmitter();
    @Output() ProductWarning: EventEmitter<any> = new EventEmitter();
    @Output() CloseModal: EventEmitter<any> = new EventEmitter();
    @Output() RefreshTable: EventEmitter<void> = new EventEmitter();
    
    @Input() selectedRowData: any;
    @Input() formAddAttribute!: boolean;
    @Input() formEditAttribute!: boolean;
    @Input() formDeleteAttribute!: boolean;
    
    textcolor: string = 'text-light-subtle'
    
    addAttributeForm: FormGroup;
    editAttributeForm: FormGroup;
    deleteAttributeForm: FormGroup;
    private refreshData$ = new Subject<void>();
    
    constructor(
        private attribute_service: AttributesService,
        private formBuilder: FormBuilder,
    ){
        this.addAttributeForm = new FormGroup({
            name: new FormControl('', Validators.required)
        });
        this.editAttributeForm = new FormGroup({
            name: new FormControl('', Validators.required)
        });

        // this.deleteAttributeForm = new FormGroup({
        //     id: new FormArray[]
        // });
    }
    
    refreshTableData(): void {
        this.refreshData$.next();
    }
    
    onAttributeAddSubmit(): void {
        if(this.addAttributeForm.valid){

            
            let formData: any = new FormData();
            formData.append('name', this.addAttributeForm.get('name')?.value);
            
            this.attribute_service.postAttribute(formData).subscribe({
                next: (response: any) => { 
                    const successMessage = {
                        head: 'Category ' + this.addAttributeForm.get('name')?.value,
                        sub: response?.message
                    };
                    
                    this.RefreshTable.emit();
                    this.refreshTableData();
                    this.ProductSuccess.emit(successMessage);
                    this.addAttributeForm.reset();

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
                            errorMessage: 'Error Invalid Inputs',
                            suberrorMessage: errorsArray,
                        };
                    
                        this.ProductWarning.emit(errorDataforProduct);
                    } else {
                    
                        const errorDataforProduct = {
                            errorMessage: 'Error Invalid Inputs',
                            suberrorMessage: 'Please Try Another One',
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
                errorMessage: `Please fill in the following required fields: `,
                suberrorMessage: emptyFields.join(', ')
            };
            this.ProductWarning.emit(errorData);
            
        }

console.log(this.addAttributeForm.get('name')?.value)
    }
    
    onAttributeEditSubmit(): void {
        if(this.editAttributeForm.valid){

            let formData: any = new FormData();
            formData.append('id', this.selectedRowData.id);
            formData.append('name', this.editAttributeForm.get('name')?.value);
            
            for (const value of formData.entries()) {
                console.log(`${value[0]}, ${value[1]}`);
            }
            // this.attribute_service.postAttribute(formData).subscribe({
            //     next: (response: any) => { 
            //         const successMessage = {
            //             head: 'Category ' + this.editAttributeForm.get('name')?.value,
            //             sub: response?.message
            //         };
                    
            //         this.RefreshTable.emit();
            //         this.refreshTableData();
            //         this.ProductSuccess.emit(successMessage);

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
            //                 errorMessage: 'Error Invalid Inputs',
            //                 suberrorMessage: errorsArray,
            //             };
                    
            //             this.ProductWarning.emit(errorDataforProduct);
            //         } else {
                    
            //             const errorDataforProduct = {
            //                 errorMessage: 'Error Invalid Inputs',
            //                 suberrorMessage: 'Please Try Another One',
            //             };
            //             this.ProductError.emit(errorDataforProduct);
            //         }
            //         return throwError(() => error);
                    
            //     }
            // });
        
            
        }else{
            this.editAttributeForm.markAllAsTouched();
            const emptyFields = [];
            for (const controlName in this.editAttributeForm.controls) {
                if (this.editAttributeForm.controls.hasOwnProperty(controlName) && this.editAttributeForm.controls[controlName].errors?.['required']) {
                    const label = document.querySelector(`label[for="${controlName}"]`)?.textContent || controlName;
                    emptyFields.push(label);
                }
            }

            const errorData = {
                errorMessage: `Please fill in the following required fields: `,
                suberrorMessage: emptyFields.join(', ')
            };
            this.ProductWarning.emit(errorData);
            
        }


    }
    
    onAttributeDeleteSubmit(): void {
        let formData: any = new FormData();
            formData.append('id', this.selectedRowData.id);
            
            for (const value of formData.entries()) {
                console.log(`${value[0]}, ${value[1]}`);
            }
    }
    
}
