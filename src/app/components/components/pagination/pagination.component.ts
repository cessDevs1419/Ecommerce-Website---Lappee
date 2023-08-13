import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  /* 
  == USAGE ==
  1. ensure data is an array
  2. implement a paginate function that slices the array:

    paginateReview(): Review[] {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.reviewListArray.slice(startIndex, startIndex + this.itemsPerPage);
    }
  
  3. implement a function that changes the currentpage variable
    
      onPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
      }

  4. bind the component variables as inputs for app-pagination
      
      <app-pagination [itemsPerPage]="itemsPerPage" [totalItems]="reviewListArray.length" (pageChange)="onPageChange($event)"></app-pagination>

  */
  @Input() itemsPerPage: number;
  @Input() totalItems: number;
  @Input() visiblePages: number = 3;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  currentPage: number = 1;


  get totalPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getPaginationRange(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const halfVisiblePages = Math.floor(this.visiblePages / 2);

    let startPage = Math.max(1, this.currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, startPage + this.visiblePages - 1);

    // Adjust the start page if the end page would exceed the total pages
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - this.visiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.pageChange.emit(this.currentPage);
  }

  
}
