import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, NgZone, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, catchError, map, startWith, switchMap, tap, throwError } from 'rxjs';
import { ModalComponent } from 'src/app/components/components/modal/modal.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AttributesService } from 'src/app/services/attributes/attributes.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { formatAdminCategories, formatAttributes, formatAttributesDetails } from 'src/app/utilities/response-utils';
import { AttributesDetails } from 'src/assets/models/attributes';
import { AdminCategory } from 'src/assets/models/categories';

@Component({
  selector: 'app-admin-attributes',
  templateUrl: './admin-attributes.component.html',
  styleUrls: ['./admin-attributes.component.css']
})
export class AdminAttributesComponent {
	
	@ViewChild(ToastComponent) toast: ToastComponent;
	@ViewChild(ToasterComponent) toaster: ToasterComponent;
  @ViewChild(TableComponent) table: TableComponent;
	@ViewChild('triggerFunction') childComponent: TableComponent;
  showMinus: boolean = false
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild('closeBtn') modalClose: ElementRef
  selectedRowData: any;
  selectedRowDataForDelete: any;
  attributes!: Observable<AdminCategory[]>;
  attributesDetail!: Observable<AttributesDetails>;
  attributesDetails: any[] = [];
  newattributes: any[] = [];
  addAttributeForm: FormGroup;
  
  bordercolor: string = 'dark-subtle-borders'
  textcolor: string = 'text-light-subtle'
  titleColor: string = 'color-adm-light-gray';
  backdrop: string = 'true';
	toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default";  

  private refreshData$ = new Subject<void>();
  
  constructor(
      private zone: NgZone,
      private formBuilder: FormBuilder,
		  private attribute_service: AttributesService,
	) {
    this.addAttributeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      attribute_value: this.formBuilder.array([])
  });
	}
	
  ngOnInit(): void{
    
    this.attributes = this.refreshData$.pipe(
        startWith(undefined), 
        switchMap(() => this.attribute_service.getAttribute()),
        map((Response: any) => formatAttributes(Response)),
        tap(() => {
          this.table.loaded()
        })
    );



  }

refreshTableData(): void {
  this.refreshData$.next();
}
onRowDataForDelete(rowData: any){
  this.selectedRowDataForDelete = rowData; 
}
onRowDataSelected(rowData: any) {
  this.selectedRowData = rowData;
  this.attributesDetail = this.attribute_service.getAttributeDetails(rowData.id)
  .pipe(
    map((response: any) => response.data),
    catchError((error: HttpErrorResponse) => {
      console.log(error);
      // Handle the error if needed
      return [];
    })
  );
  this.addExistingAttributeName(rowData.name)
  this.modal.reset()
  this.attribute_service.getAttributeDetails(rowData.id).subscribe(data => {
    this.addExistingAttributeValue(data.data.values)
  })


}

showMinusFunction(){
  this.childComponent.removeAllSelected();
}

addAttributeValue(){
  const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray
  attributeArray.push(new FormControl(''));
  this.newattributes.push(new FormControl(''))
}   

addExistingAttributeName(name: string){
  this.addAttributeForm.get('name')?.setValue(name)
}   

addExistingAttributeValue(value: any[]) {
  const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray;
  attributeArray.clear();
  this.attributesDetails.splice(0)

  for (const item of value) {
    attributeArray.push(this.formBuilder.control(item));
    this.attributesDetails.push(item)
  }

}

get attributeValueControls() {
  return (this.addAttributeForm.get('attribute_value') as FormArray).controls;
}

removeAttributeValue(index: number) {
  const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray;
  const existing = this.attributesDetails.find(item => item === attributeArray.value[index]);

  if(existing){
    const errorDataforProduct = {
        head: 'Product Management',
        sub: 'Cannot delete existing value.',
    };
    
    this.WarningToast(errorDataforProduct);
    
  }else{
    attributeArray.removeAt(index);
  }
  
  
}

onAttributeEditSubmit(): void {

  const nameValue = this.addAttributeForm.get('name')?.value; 
  const capitalizedName = nameValue.charAt(0).toUpperCase() + nameValue.slice(1);
 
  const attributeArray = this.addAttributeForm.get('attribute_value') as FormArray;
  // const attributeExisting = this.attributeDetails;

  let formData: FormData = new FormData(); 
  formData.append('id', this.selectedRowData.id);
  formData.append('name', capitalizedName);

  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  this.attribute_service.patchAttribute(formData).subscribe({
      next: (response: any) => { 
          const successMessage = {
              head: 'Attribute ' + this.addAttributeForm.get('name')?.value,
              sub: response?.message
          };
          
          this.refreshTableData();
          this.SuccessToast(successMessage);
          this.addAttributeForm.reset();
          attributeArray.clear();
          this.modalClose.nativeElement.click()
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
          
              this.WarningToast(errorDataforProduct);
          } else {
          
              const errorDataforProduct = {
                  head: 'Error Invalid Inputs',
                  sub: 'Please Try Another One',
              };
              this.ErrorToast(errorDataforProduct);
          }
          
          return throwError(() => error);
          
      }
  });
  
  if(this.newattributes.length > 0){
      let formData: FormData = new FormData(); 
        formData.append('attribute_id', this.selectedRowData.id);
        
        for (let val of attributeArray.value) {
            let index = 0;
            const capitalizedAttributeValue = val.charAt(0).toUpperCase() + val.slice(1);
            formData.append('values[]', capitalizedAttributeValue);
            index++;
        }

      this.attribute_service.postValue(formData).subscribe({
          next: (response: any) => { 
              const successMessage = {
                  head: 'Attribute ' + this.addAttributeForm.get('name')?.value,
                  sub: response?.message
              };
              
              this.refreshTableData();
              this.SuccessToast(successMessage);
              this.addAttributeForm.reset();
              attributeArray.clear();
              this.modalClose.nativeElement.click()
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
              
                  this.WarningToast(errorDataforProduct);
              } else {
              
                  const errorDataforProduct = {
                      head: 'Error Invalid Inputs',
                      sub: 'Please Try Another One',
                  };
                  this.ErrorToast(errorDataforProduct);
              }
              
              return throwError(() => error);
              
          }
      }); 
  }

}



SuccessToast(value: any): void {
  this.toaster.showToast(value.head, value.sub, 'default', '', )
}

WarningToast(value: any): void {
  this.toaster.showToast(value.head, value.sub, 'warn', '', )
}

ErrorToast(value: any): void {
  this.toaster.showToast(value.head, value.sub, 'negative', '', )
}


}
