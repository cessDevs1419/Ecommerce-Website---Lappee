import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, map, startWith, switchMap, tap, throwError } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductGroupService } from 'src/app/services/product-group/product-group.service';
import { formatAdminCategories } from 'src/app/utilities/response-utils';
import { AdminCategory } from 'src/assets/models/categories';

@Component({
  selector: 'app-product-group-form',
  templateUrl: './product-group-form.component.html',
  styleUrls: ['./product-group-form.component.css']
})
export class ProductGroupFormComponent {
  @Output() OrderSuccess: EventEmitter<any> = new EventEmitter();
  @Output() OrderWarn: EventEmitter<any> = new EventEmitter();
  @Output() OrderError: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Output() ship: EventEmitter<any> = new EventEmitter();
  @Output() CloseModal: EventEmitter<any> = new EventEmitter();
  @Output() RefreshTable: EventEmitter<void> = new EventEmitter();

  inputColor: string = "text-white"
  borderColor: string = "border-grey"
  textcolor: string = 'text-light-subtle'
  bordercolor: string = 'dark-subtle-borders'
  titleColor : string = 'dark-theme-text-color';
  itemColor: string = 'text-white-50';
  selectedReason: string = '';
  categories!: Observable<AdminCategory[]>;
  
	selectedItemsPerGroup: any;

  @Input() selectedRowData!: any;
  @Input() formAddProductGroup!: boolean;
  private refreshData$ = new Subject<void>();
    
  constructor(
		private category_service: CategoriesService,
    private product_group: ProductGroupService
	) {
    
	}
	
	ngOnInit(): void{
    
        this.categories = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.category_service.getAdminCategories()),
            map((Response: any) => formatAdminCategories(Response)) 
        );
  }


  refreshTableData(): void {
      this.refreshData$.next();
  }

  setProductGroup(items: { id: string; value: string }){
    this.selectedItemsPerGroup = items
  }

  onSubmitProductGroup(){

    const selectedProductGroup = this.selectedItemsPerGroup;
    let formData: FormData = new FormData();

  
    let index = 0;

    for (let val of selectedProductGroup) {
      const value = val.value
      if (value === 'Tops') {
        formData.append('tops[]', val.id);
      } else {
        formData.append('bottoms[]', val.id);
      }

    }
  
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    this.product_group.postAdminProductGroup(formData).subscribe({
      next: async(response: any) => { 
          const successMessage = {
              head: 'Product Group',
              sub: response?.message
          };
          
          this.RefreshTable.emit();
          this.OrderSuccess.emit(successMessage);

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
                          errorMessage = messages.join(' '); 
                      }
                      errorsArray.push(errorMessage);
                  }
              }
          
              const errorDataforProduct = {
                  head: 'Error Invalid Inputs',
                  sub: errorsArray,
              };
          
              this.OrderWarn.emit(errorDataforProduct);
          } else {
          
              const errorDataforProduct = {
                  head: 'Error Invalid Inputs',
                  sub: 'Please Try Another One',
              };
              this.OrderError.emit(errorDataforProduct);
          }
          return throwError(() => error);
      }

    });
  }
}
