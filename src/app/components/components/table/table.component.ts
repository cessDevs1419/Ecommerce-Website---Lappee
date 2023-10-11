import { ChangeDetectionStrategy, ChangeDetectorRef, Component,ElementRef,EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable, of} from 'rxjs';
import { map , startWith } from 'rxjs';
import { Product } from 'src/assets/models/products';
import { ModalComponent } from '../modal/modal.component';
import { FormGroup } from '@angular/forms';

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
	
	@ViewChild('checkboxDiv') checkboxDiv: ElementRef;
	@ViewChild('checkboxInput', { static: false }) checkboxInput: ElementRef;
	
	@Output() rowDataSelected: EventEmitter<any> = new EventEmitter<any>();
	@Output() rowDataForDelete: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowAddForm: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowEditForm: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowAddSubForm: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowEditSubForm: EventEmitter<any> = new EventEmitter<any>();

	//table theme
	table_container_bg: string = 'table-bg-dark'
	tabletitlecolor: string = 'text-white'
	tablesubtitlecolor: string = 'text-secondary'
	textcolor: string = 'text-light-subtle'
	borders: string = 'dark-subtle-borders'
	btncolor: string = 'dark-subtle-btn'
	tableHeaderbg: string = 'bg-header-dark'
	actionbarbtnbg: string = 'item-selected'
	bordercolor: string = 'dark-border-table'
	checkboxcolor: string = 'dark-border-checkbox'
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
	@Input() addProdBtn!: boolean;
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
	@Input() tableChildContainer: string;
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
	
	isAllChecked: boolean;
	selectedIds: number[] = [];
	checkedState: { [key: number]: boolean } = {};
	rowActionVisibility: boolean[] = [];
	activeButtonIndex: number | null = null;
	showMinus: boolean;
	showTooltip: boolean;
	currentPage: number = 1;
	pageSizeOptions: number[] = [5, 10, 25, 50];
	pageSize: number = this.pageSizeOptions[0];
	totalItems: number;
	totalPages: number;
	displayedItems$: Observable<any[]>;

	searchFilter: string = '';

	constructor(private cdr: ChangeDetectorRef) {} 
	ngAfterViewInit() {
		// Access the checkboxInput element after it's available in the DOM
		const selectAllCheckbox = this.checkboxInput.nativeElement as HTMLInputElement;
		// Now you can use selectAllCheckbox as needed
	}
	
	
	showAction(rowIndex: number) {
		this.rowActionVisibility[rowIndex] = !this.rowActionVisibility[rowIndex];

		for (let i = 0; i < this.rowActionVisibility.length; i++) {
			if (i !== rowIndex) {
				this.rowActionVisibility[i] = false;
			}
		}
		
		if (this.activeButtonIndex === rowIndex) {

			this.activeButtonIndex = null;
		} else {
			this.activeButtonIndex = rowIndex;
		}
	}
	
	selectAll() {
		this.tableData.subscribe((data) => {
			const areAllSelected = this.selectedIds.length === data.length;
			const selectAllCheckbox = this.checkboxInput.nativeElement as HTMLInputElement;
			
			if(selectAllCheckbox.checked)
			{
				this.showMinus = true
				if (areAllSelected) {
					this.selectedIds = [];
					this.rowDataForDelete.emit(this.selectedIds);
					data.forEach((item: any) => (this.checkedState[item.id] = false));
				} else {
					this.selectedIds = data.map((item: any) => item.id);
					this.rowDataForDelete.emit(this.selectedIds);
					data.forEach((item: any) => (this.checkedState[item.id] = true));
				}
			}else{
				this.showMinus = false
				this.selectedIds = [];
				this.rowDataForDelete.emit(this.selectedIds);
				data.forEach((item: any) => (this.checkedState[item.id] = false));
			}
			

			
			this.cdr.detectChanges();
		});
	}


	toggleSelection(item: any, event: any) {
		const target = event.target as HTMLInputElement;
		const checked = target.checked;
	
		if (checked) {
			this.selectedIds.push(item.id);
			this.rowDataForDelete.emit(this.selectedIds);
		} else {
			const index = this.selectedIds.indexOf(item.id);
			if (index !== -1) {
				this.selectedIds.splice(index, 1);
				
			}
			this.rowDataForDelete.emit(this.selectedIds);
		}
		this.checkedState[item.id] = checked;
		
		// Check if all checkboxes are unchecked and uncheck the "Select All" checkbox
		const areAllUnSelected = this.selectedIds.length === 0;
		const selectAllCheckbox = this.checkboxInput.nativeElement as HTMLInputElement;
		if (areAllUnSelected) {
			selectAllCheckbox.checked = false;
			this.showMinus = false
		}else{
			selectAllCheckbox.checked = true;
			this.showMinus = true
		}
	}
	
	isChecked(id: number): boolean {
		return this.checkedState[id] || false;
	}
	
	removeAllSelected() {
		const selectAllCheckbox = this.checkboxInput.nativeElement as HTMLInputElement;
		selectAllCheckbox.checked = false;
		this.selectedIds.forEach(id => (this.checkedState[id] = false));
		this.selectedIds = [];
	}

	
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
