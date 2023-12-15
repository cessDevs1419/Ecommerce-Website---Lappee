import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Observable, Subject, map, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { ModalComponent } from 'src/app/components/components/modal/modal.component';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { EchoService } from 'src/app/services/echo/echo.service';
import { OrderService } from 'src/app/services/order/order.service';
import { formatAdminOrder, formatAdminOrderDetail, formatReturnOrder } from 'src/app/utilities/response-utils';
import { AdminOrder, AdminOrderContent, AdminOrderDetail, AdminOrderDetailList, OrderReturn } from 'src/assets/models/order-details';
import { Order } from 'src/assets/models/products';

@Component({
  selector: 'app-admin-return',
  templateUrl: './admin-return.component.html',
  styleUrls: ['./admin-return.component.css']
})
export class AdminReturnComponent {
  @ViewChild(ToasterComponent) toaster: ToasterComponent;
    @ViewChild(TableComponent) table: TableComponent;
    @ViewChild(ModalComponent) modal: ModalComponent;


    backdrop: string = 'true';
    toastContent: string = "";
    toastHeader: string = "";
    toastTheme: string = "default";  
    titleColor: string = 'color-adm-light-gray';
    textColor: string = 'text-secondary';
    borderColor: string = '';
    backGround: string = '';
    btncolor: string = 'btn-primary glow-primary'
    inputColor: string = "text-white"
    textcolor: string = 'text-light-subtle'
    bordercolor: string = 'dark-subtle-borders'
	itemColor: string = 'text-white-50';
    size: string = 'w-100';

    orders!: Observable<OrderReturn[]>;
	ordersDetails$!: Observable<any>;
    ordersContents$: Observable<AdminOrderContent[]>;
  returnConfirmData!: any;
  returnDataImg!: Observable<any>;
  returnData!: any;
    
    returnStatus: number = 300;
    transitStatus: number = 320; 
	receivedStatus: number = 0;

	private refreshData$ = new Subject<void>();
    selectedRowData!: any;
    
    constructor(
        private echo: EchoService, 
		private service: OrderService,
		private cdr: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
	) {


  }
	
	ngOnInit(): void{
		this.orders = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.service.getReturnList()),
            map((Response: any) => formatReturnOrder(Response))            ,
            tap(() => {
                this.table.loaded()
            })
        );
        
        this.echo.listen('admin.notifications.orders', 'OrderStatusAlert', (data: any) => {
            this.refreshTableData();
        })

          this.echo.listen('admin.notifications.orders.placed', 'OrderPlaced', (data: any) => {
            this.refreshTableData();
          })
          this.echo.listen('admin.notifications.orders.cancelled', 'OrderCancelled', (data: any) => {
            this.refreshTableData();
          })
	}

    refreshTableData(): void {
        this.refreshData$.next();
    }

    showPage(data: any){
      this.router.navigate(['/admin/chats',data.conversation_id]);
    }

    onRowDataSelected(rowData: any) {
        this.selectedRowData = rowData;
        this.service.getAdminOrderDetail(this.selectedRowData.id).subscribe({
            next: (response: any) => {
                const data = formatAdminOrderDetail(response);
                this.ordersContents$ = of(data.order_contents); 
                this.ordersDetails$ = of(data); 
            },
            error: (error: HttpErrorResponse) => {
                console.log(error);
            }
        }); 
        
    }

   

    getDate(event: any){
        console.log(event)
    }
    
    getStatus(event: any){
        console.log(event)
    }
    
    onConfirmSubmit(){

      let formData: any = new FormData();
      formData.append('order_id',  this.selectedRowData.id);
      formData.append('tracking_no',  310);

      formData.forEach((value: any, key: any) => {
        console.log(`${key}: ${value}`);
      });

      this.orderService.patchOrderReturnConfirm(formData).subscribe({
        next: async(response: any) => { 
            const successMessage = {
                head: 'Return Order',
                sub: response?.message
            };
            
            this.SuccessToast(successMessage);


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
                    errorMessage: 'Error Invalid Inputs',
                    suberrorMessage: errorsArray,
                };
            
                this.WarningToast(errorDataforProduct);
            } else {
            
                const errorDataforProduct = {
                    errorMessage: 'Error Invalid Inputs',
                    suberrorMessage: 'Please Try Another One',
                };
                this.WarningToast(errorDataforProduct);
            }
            return throwError(() => error);
        }
        
      });
    }

    onViewedSubmit(){
      let formData: any = new FormData();
      formData.append('order_id',  this.selectedRowData.id);
      formData.append('tracking_no',  320);

      formData.forEach((value: any, key: any) => {
        console.log(`${key}: ${value}`);
      });

      // this.orderService.patchOrderReturnViewed(formData).subscribe({
      //   next: async(response: any) => { 
      //       const successMessage = {
      //           head: 'Return Order',
      //           sub: response?.message
      //       };
            
      //       this.SuccessToast(successMessage);


      //   },
      //   error: (error: HttpErrorResponse) => {
      //       if (error.error?.data?.error) {
      //           const fieldErrors = error.error.data.error;
      //           const errorsArray = [];
            
      //           for (const field in fieldErrors) {
      //               if (fieldErrors.hasOwnProperty(field)) {
      //                   const messages = fieldErrors[field];
      //                   let errorMessage = messages;
      //                   if (Array.isArray(messages)) {
      //                       errorMessage = messages.join(' '); 
      //                   }
      //                   errorsArray.push(errorMessage);
      //               }
      //           }
            
      //           const errorDataforProduct = {
      //               errorMessage: 'Error Invalid Inputs',
      //               suberrorMessage: errorsArray,
      //           };
            
      //           this.WarningToast(errorDataforProduct);
      //       } else {
            
      //           const errorDataforProduct = {
      //               errorMessage: 'Error Invalid Inputs',
      //               suberrorMessage: 'Please Try Another One',
      //           };
      //           this.WarningToast(errorDataforProduct);
      //       }
      //       return throwError(() => error);
      //   }
        
      // });
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
