import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { ChatsComponent } from 'src/app/components/components/chats/chats.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
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
  backdrop: string = 'true';
  toastContent: string = "";
  toastHeader: string = "";
  toastTheme: string = "default";  
  
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
  private sizeChartService: SizeChartService
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
