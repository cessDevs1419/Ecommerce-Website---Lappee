import { ChangeDetectionStrategy, ChangeDetectorRef, Component,ElementRef,EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
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
	@ViewChild('date') date: ElementRef;
	@ViewChild('checkboxInput', { static: false }) checkboxInput: ElementRef;
	
	@Output() rowDataSelected: EventEmitter<any> = new EventEmitter<any>();
	@Output() rowDataForDelete: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowAddForm: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowEditForm: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowAddSubForm: EventEmitter<any> = new EventEmitter<any>();
	@Output() ShowEditSubForm: EventEmitter<any> = new EventEmitter<any>();
	@Output() FilterValue: EventEmitter<any> = new EventEmitter<any>();
	@Output() DateValue: EventEmitter<any> = new EventEmitter<any>();
	@Output() showEvent: EventEmitter<any> = new EventEmitter<any>();
	
	//table theme
	table_container_bg: string = 'table-bg-dark'
	tabletitlecolor: string = 'text-white'
	tablesubtitlecolor: string = 'text-secondary'
	textcolor: string = 'text-light-subtle'
	borders: string = 'dark-subtle-borders'
	btncolor: string = 'dark-subtle-btn'
	tableHeaderbg: string = 'bg-header-dark'
	actionbarbtnbg: string = 'item-selected'
	bordercolor: string = 'table-border-color'
	tablebordercolor: string = 'linear-gradient-border'
	checkboxcolor: string = 'dark-border-checkbox'
	btnborders: string = 'border-dark-subtle'
	
	public searchString: string;
	selectedStatus: string = 'Status';
	sortedData: any[] = [];

	//Table Title 
	@Input() tableTitle: string;
	@Input() subTitle: string;
	@Input() tableHead!: boolean;
	
	//enable table header tools
	@Input() tableTools!: boolean;
	@Input() paginate!: boolean;
	@Input() searchBar!: boolean;
	@Input() Btntools!: boolean;
	@Input() tableHeaderActions!: boolean;
	//addBtn Details
	@Input() addBtn!: boolean;
	@Input() addProdBtn!: boolean;
	@Input() addbtnName!: string;
	@Input() addCategoryBtn!: boolean;
	@Input() addCategoryName!: string;
	@Input() addSubBtn!: boolean;
	@Input() addSubtnName!: string;
	
	//enable Table Action Column && Other Buttons
	@Input() showMultipleSelection!: boolean;
	@Input() tableAction!: boolean;
	@Input() actionBtn!: boolean;
	@Input() actionForOrderBtn!: boolean;
	@Input() elipsesActionBtn!: boolean;
	@Input() restockBtn!: boolean;
	@Input() editBtn!: boolean;
	@Input() editSubBtn!: boolean;
	@Input() deleteBtn!: boolean;
	@Input() deleteSubBtn!: boolean;
	@Input() viewBtn!: boolean;
	@Input() viewBtn2!: boolean;
	@Input() banBtn!: boolean;
	@Input() cancelOrder!: boolean;
	
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
	@Input() packStatus!: number;
	@Input() shipStatus!: number;
	@Input() deliverStatus!: number;
	@Input() orderBtn!: boolean;
	@Input() orderBtnSet!: boolean;
	@Input() bannedBtn: boolean;
	@Input() setFirstUpper!: boolean;
	@Input() showMinus!: boolean;
	@Input() checkBtn!: boolean;
	@Input() chatBtn!: boolean;
	showCheckboxMinus: boolean;
	isAllChecked: boolean;
	selectedIds: number[] = [];
	checkedState: { [key: number]: boolean } = {};
	rowActionVisibility: boolean[] = [];
	rowOrderActionVisibility: boolean[] = [];
	activeButtonIndex: number | null = null;
	activeOrderButtonIndex: number | null = null;
	showTooltip: boolean;
	currentPage: number = 1;
	pageSizeOptions: number[] = [5, 10, 25, 50];
	pageSize: number = this.pageSizeOptions[0];
	totalItems: number;
	totalPages: number;
	displayedItems$: Observable<any[]>;
	selectedDate: string;
	searchFilter: string = '';
	sortedTableData: any[];

	constructor(private cdr: ChangeDetectorRef) {} 
	
	ngAfterViewInit() {
		// Access the checkboxInput element after it's available in the DOM
		// const selectAllCheckbox = this.checkboxInput.nativeElement as HTMLInputElement;
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
	
	showEdit(index: number){
	
	}

	showOrderAction(rowIndex: number) {
		this.rowOrderActionVisibility[rowIndex] = !this.rowOrderActionVisibility[rowIndex];

		for (let i = 0; i < this.rowOrderActionVisibility.length; i++) {
			if (i !== rowIndex) {
				this.rowOrderActionVisibility[i] = false;
			}
		}
		
		if (this.activeOrderButtonIndex === rowIndex) {

			this.activeOrderButtonIndex = null;
		} else {
			this.activeOrderButtonIndex = rowIndex;
		}
	}
	
	selectDate(){
		this.date.nativeElement.showPicker()
	}
	
	onStatusChange() {
		this.FilterValue.emit(this.selectedStatus)
	}

	getDateValue(event: any) {
		// this.selectedDate = event.target.value;
		this.DateValue.emit(event.target.value)
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
					data.forEach((item: any) => (this.checkedState[item.product_id] = false));
				} else {
					this.selectedIds = data.map((item: any) => item.id || item.product_id);
					this.rowDataForDelete.emit(this.selectedIds);
					data.forEach((item: any) => (this.checkedState[item.id] = true));
					data.forEach((item: any) => (this.checkedState[item.product_id] = true))
				}
			}else{
				this.showMinus = false
				this.selectedIds = [];
				this.rowDataForDelete.emit(this.selectedIds);
				data.forEach((item: any) => (this.checkedState[item.id || item.product_id] = false));
				data.forEach((item: any) => (this.checkedState[item.product_id] = false));
			}
			

			this.cdr.detectChanges();
		});
	}

	toggleSelection(item: any, event: any) {
		const target = event.target as HTMLInputElement;
		const checked = target.checked;
	
		if (checked) {
			this.selectedIds.push(item.id || item.product_id);
			this.rowDataForDelete.emit(this.selectedIds);
		} else {
			const index = this.selectedIds.indexOf(item.id || item.product_id);
			if (index !== -1) {
				this.selectedIds.splice(index, 1);
				
			}
			this.rowDataForDelete.emit(this.selectedIds);
		}
		this.checkedState[item.id || item.product_id] = checked;
		
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
		return this.checkedState[id] || false ;
	}
	
	removeAllSelected() {
		const selectAllCheckbox = this.checkboxInput.nativeElement as HTMLInputElement;
		selectAllCheckbox.checked = false;
		this.selectedIds.forEach(product_id => (this.checkedState[product_id] = false));
		this.selectedIds.forEach(id => (this.checkedState[id] = false));
		this.selectedIds = [];

		const areAllUnSelected = this.selectedIds.length === 0;
		
		if (areAllUnSelected) {
			selectAllCheckbox.checked = false;
			this.showMinus = false
		}else{
			selectAllCheckbox.checked = true;
			this.showMinus = true
		}
		
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
		// this.selectedIds.push(row.id);
		// this.rowDataForDelete.emit(this.selectedIds);
	}
	
	showPage(row: any): void{
		this.showEvent.emit(row)
	}
	
	showAddForm(): void{
		this.ShowAddForm.emit()
	}
	
	showEditForm(row: any): void{
		this.ShowEditForm.emit(row)
	}

	showAddSubForm(): void{
		this.ShowAddSubForm.emit()
	}

	showEditSubForm(): void{
		this.ShowEditSubForm.emit()
	}
	

	
	
}
