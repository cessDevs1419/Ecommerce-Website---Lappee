import { Component,EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
    styleUrls: ['./table.component.css']
})
export class TableComponent {

	public searchString: string;
	
	//Table Title 
	@Input() tableTitle: string;
	@Input() subTitle: string;
	
	//enable table header tools
	@Input() tableTools!: boolean;
	@Input() searchBar!: boolean;
	@Input() Btntools!: boolean;
	
	//addBtn Details
	@Input() addBtn!: boolean;
	@Input() addbtnName!: string;
	@Input() addSubBtn!: boolean;
	@Input() addSubtnName!: string;
	
	//enable Table Action Column && Other Buttons
	@Input() tableAction!: boolean;
	@Input() restockBtn!: boolean;
	@Input() editBtn!: boolean;
	@Input() deleteBtn!: boolean;
	@Input() viewBtn!: boolean;
	@Input() banBtn!: boolean;
	
	
	//table Data
	@Input() tableHeader!: any[];
	@Input() tableRows!: any[];
	@Input() tableData!: Observable<any>;
	
	@Input() InputpageSize!: any[];
	
	//addClass to evey table element
	@Input() searchBarclass: string;
	@Input() addBtnclass: string;
	@Input() addSubBtnclass: string;
	@Input() restockBtnclass: string;
	@Input() editBtnclass: string;
	@Input() deleteBtnclass: string;
	@Input() viewBtnclass: string;
	@Input() banBtnclass: string;
	
	
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
					    if (this.searchFilter) {
							const searchTerm = this.searchFilter.toLowerCase();
							filteredData = data.filter(item =>
						    item.property.toLowerCase().includes(searchTerm)
						);
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
	
	@Output() rowDataSelected: EventEmitter<any> = new EventEmitter<any>();

	sendRowData(row: any) {
	    this.rowDataSelected.emit(row);
	}
	
	
}
