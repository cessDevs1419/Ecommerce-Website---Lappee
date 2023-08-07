import { ChangeDetectionStrategy, Component,EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable, of} from 'rxjs';
import { map , startWith } from 'rxjs';
import { Product } from 'src/assets/models/products';
import { ModalComponent } from '../modal/modal.component';

interface TableItem {
    property: string;
}
@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
	
	@Output() rowDataSelected: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowAddForm: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowEditForm: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowAddSubForm: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowEditSubForm: EventEmitter<any> = new EventEmitter<any>();

	public searchString: string;
	
	//Table Title 
	@Input() tableTitle: string;
	@Input() subTitle: string;
	@Input() tableHead!: boolean;
	
	//enable table header tools
	@Input() tableTools!: boolean;
	@Input() paginate!: boolean;
	@Input() searchBar!: boolean;
	@Input() Btntools!: boolean;
	
	//addBtn Details
	@Input() addBtn!: boolean;
	@Input() addbtnName!: string;
	@Input() addCategoryBtn!: boolean;
	@Input() addCategoryName!: string;
	@Input() addSubBtn!: boolean;
	@Input() addSubtnName!: string;
	
	//enable Table Action Column && Other Buttons
	@Input() tableAction!: boolean;
	@Input() restockBtn!: boolean;
	@Input() editBtn!: boolean;
	@Input() editSubBtn!: boolean;
	@Input() deleteBtn!: boolean;
	@Input() deleteSubBtn!: boolean;
	@Input() viewBtn!: boolean;
	@Input() viewBtn2!: boolean;
	@Input() banBtn!: boolean;
	
	@Input() bannedStatus: { [userId: number]: boolean } = {};
	@Input() deliveredStatus: { [status: number]: boolean } = {};
	
	//table Data
	@Input() tableHeader!: any[];
	@Input() tableRows!: any[];
	@Input() tableData!: Observable<any>;
	
	@Input() InputpageSize!: any[];
	
	//addClass to evey table element
	@Input() tableContainerClass: string;
	@Input() searchBarclass: string;
	@Input() addBtnclass: string;
	@Input() addSubBtnclass: string;
	@Input() restockBtnclass: string;
	@Input() editBtnclass: string;
	@Input() deleteBtnclass: string;
	@Input() viewBtnclass: string;
	@Input() banBtnclass: string;
	
	@Input() paymentStatus!: number;
	@Input() shipStatus!: number;
	@Input() deliverStatus!: number;
	@Input() orderBtn: boolean;
	@Input() setFirstUpper!: boolean;
	
	currentPage: number = 1;
	pageSizeOptions: number[] = [5, 10, 25, 50];
	pageSize: number = this.pageSizeOptions[0];
	totalItems: number;
	totalPages: number;
	displayedItems$: Observable<any[]>;

	searchFilter: string = '';


	ngOnInit() {
	    this.calculatePagination();
	}

	
	applySearchFilter(): void {
		this.currentPage = 1;
		this.calculatePagination();
	}
	
	calculatePagination(): void {
		if (this.tableData) {
			this.displayedItems$ = this.tableData.pipe(
				map((data: any[]) => {
					let filteredData = data;
	
					if (this.searchFilter && this.searchFilter.trim() !== '') {
						const searchTerm = this.searchFilter.toLowerCase();
						filteredData = data.filter(item => {
							// Combine values from all columns for search
							const combinedValues = this.tableRows.map(row => item[row]).join(' ').toLowerCase();
							return combinedValues.includes(searchTerm);
						});
					}
	
					this.totalItems = filteredData.length;
					this.totalPages = Math.ceil(this.totalItems / this.pageSize);
					const startIndex = (this.currentPage - 1) * this.pageSize;
					const endIndex = startIndex + this.pageSize;
					return filteredData.slice(startIndex, endIndex);
				}),
				startWith([]) // Start with an empty array to clear the table when the search input is removed
			);
		}
	}
	

	goToPreviousPage(): void {
	  if (this.currentPage > 1) {
		this.currentPage--;
		this.calculatePagination();
	  }
	}

	goToNextPage(): void {
	    if (this.currentPage < this.totalPages) {
		this.currentPage++;
		this.calculatePagination();
		}
	}
	
	changePageSize(event: Event): void {
	  const pageSizeValue = (event.target as HTMLSelectElement).value;
	  this.pageSize = +pageSizeValue;
	  this.currentPage = 1;
	  this.calculatePagination();
	}
	



	sendRowData(row: any) {
	    this.rowDataSelected.emit(row);

	}
	
	showAddForm(): void{
		this.ShowAddForm.emit()
	}
	
	showEditForm(): void{
		this.ShowEditForm.emit()
	}

	showAddSubForm(): void{
		this.ShowAddSubForm.emit()
	}

	showEditSubForm(): void{
		this.ShowEditSubForm.emit()
	}
	

	
	
}
