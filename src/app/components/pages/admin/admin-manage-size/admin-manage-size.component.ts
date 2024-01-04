import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { ChatsComponent } from 'src/app/components/components/chats/chats.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { SizeChartService } from 'src/app/services/size-chart/size-chart.service';
import { UsersService } from 'src/app/services/users/users.service';

import { formatBannedUser, formatSizeChart, formatUser } from 'src/app/utilities/response-utils';
import { Size } from 'src/assets/models/size-chart';
import { BannedUser, User } from 'src/assets/models/user';


@Component({
  selector: 'app-admin-manage-size',
  templateUrl: './admin-manage-size.component.html',
  styleUrls: ['./admin-manage-size.component.css']
})
export class AdminManageSizeComponent {
	tabletitlecolor: string = 'text-white'
	tablesubtitlecolor: string = 'text-secondary'
  @ViewChild(ToastComponent) toast: ToastComponent;
  @ViewChild(ToasterComponent) toaster: ToasterComponent;
  @ViewChild(TableComponent) table: TableComponent;
  @ViewChild(ChatsComponent) chats: ChatsComponent;
  @ViewChild("confirmDeleteModal") confirmDeleteModal: ElementRef;

  backdrop: string = 'true';
  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default";  
  
  titleColor: string = 'text-white';
  textColor: string = 'text-secondary';
  borderColor: string = '';
  backGround: string = '';
  btncolor: string = 'btn-primary glow-primary'
  
  size!: Observable<Size[]>;
  banned_users!: Observable<BannedUser[]>;
  bannedStatus: { [userId: string]: boolean } = {}; 
  
  active_users!: Observable<User[]>;
  private refreshData$ = new Subject<void>();
  private bannedUsersSubject = new BehaviorSubject<BannedUser[]>([]);
  banned_users$ = this.bannedUsersSubject.asObservable();
  
  modalTitle: string;
  modalBanAccounts: boolean;
  modalUnBanAccounts: boolean;
constructor(
  private sizeChartService: SizeChartService,
  private error: ErrorHandlerService
) {
  
}

ngOnInit(): void{
      this.size = this.refreshData$.pipe(
          startWith(undefined),
          switchMap(() => this.sizeChartService.getAdminSizeCharts()),
          map((response: any) => formatSizeChart(response)),
          tap(() => {
              this.table.loaded()
          })
      );
}


  refreshTableData(): void {
      this.refreshData$.next();
  }
  
  selectedRowData: any;
  
  onRowDataSelected(rowData: any) {
      this.selectedRowData = rowData;
  }

  private showSuccessToast(header: string, content: string)
  {
    this.toaster.showToast(header, content, 'default', '', )
  }

  private showFailedToast(header: string, content: string)
  {
    this.toaster.showToast(header, content, 'negative', '', )
  }
  
  private showWarnToast(header: string, content: string)
  {
    this.toaster.showToast(header, content, 'warn', '', )
  }

  closeModal()
  {
    this.confirmDeleteModal.nativeElement.click();
  }

  addSize(){

  }

  deleteSize(){
    if(this.selectedRowData != null) {
      let formData: any = new FormData();
      formData.append('id', this.selectedRowData.id);

      this.sizeChartService.deleteAdminSizeCharts(formData).subscribe({
        next: (response: any) => {
          this.closeModal();
          this.showSuccessToast('Manage Contents', response.message);
          this.refreshTableData();

        },
        error: (error: HttpErrorResponse) => {
          this.showFailedToast('Manage Contents', this.error.handle(error));
        }
      });
    } else {
      this.showWarnToast('No Section Selected', 'Please select a section to delete.');
    }
  }
}
