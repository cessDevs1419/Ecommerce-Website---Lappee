import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, map, startWith, switchMap, tap } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
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
  
	selectedItemsPerGroup: { id: any; value: string }[] = [];

  @Input() selectedRowData!: any;
  @Input() formAddProductGroup!: boolean;
  private refreshData$ = new Subject<void>();
    
  constructor(
		private category_service: CategoriesService,
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

  setProductGroup(items: any){
		const selectedItem = { id: items.id, value: items.value };
		const existingIndex = this.selectedItemsPerGroup.findIndex(
		  (item) => item.id === selectedItem.id
		);
	  
		if (existingIndex !== -1) {
		  this.selectedItemsPerGroup.splice(existingIndex, 1);
		}

		this.selectedItemsPerGroup.push(selectedItem);
  }
}
