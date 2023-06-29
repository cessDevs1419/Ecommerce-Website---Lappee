import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent {


  /*Needed for table to send data to modal*/
	selectedRowData: any;

  onRowDataSelected(rowData: any) {
      this.selectedRowData = rowData;
  }
  
  size = "w-100"
  
  
}
