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
import { formatAdminOrder, formatAdminOrderDetail } from 'src/app/utilities/response-utils';
import { AdminOrder, AdminOrderContent, AdminOrderDetail, AdminOrderDetailList } from 'src/assets/models/order-details';
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

    orders!: Observable<AdminOrder[]>;
	ordersDetails$!: Observable<any>;
    ordersContents$: Observable<AdminOrderContent[]>;
  returnConfirmData!: any;
  returnDataImg!: Observable<any>;
  returnData!: any;
    
    returnStatus: number = 300;
    transitStatus: number = 310; 
	  receivedStatus: number = 320;
    imageMessage: string
    mystyleImagesMap: Map<File, string> = new Map();
    imageMessageMap: { [fileName: string]: string } = {};
    imageResolutionStates: { [fileName: string]: boolean } = {};
    imageResolutionStatesTooltip: { [fileName: string]: boolean } = {};
    addVariantForm: FormGroup;
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

    this.addVariantForm = this.formBuilder.group({
      mystyle: this.formBuilder.array([]),
    });
  }
	
	ngOnInit(): void{
		this.orders = this.refreshData$.pipe(
            startWith(undefined), 
            switchMap(() => this.service.getAdminOrdersPending()),
            map((Response: any) => formatAdminOrder(Response))            ,
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

    showToolTip(file: File, index: number){
        this.checkImageResolution(file, (width, height, fileName) => {
            if (width < 720 || height < 1080) {
                this.imageResolutionStatesTooltip[fileName] = true;
                this.imageMessage = "The image must be at least 720px x 1080p."
            } else if(width > 2560 || height > 1440){
                this.imageResolutionStatesTooltip[fileName] = true;
                this.imageMessage = "Images up to 1440px x 2560px only."
            } else {
                this.imageResolutionStatesTooltip[fileName] = false;
            }
        });
    }

    checkImageResolution(file: File, callback: (width: number, height: number, fileName: string) => void) {
        const img = new Image();
    
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            
            callback(width, height, file.name);
        };
    
        img.src = URL.createObjectURL(file);
    }

    selectFileForAddingMyStyleImg() {

        const imageArray = this.getFileKeysMyStyles().length
        if(imageArray >= 1){
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 3',
            };
        
            this.WarningToast(errorDataforProduct);
        }else{

            const addInput = document.getElementById('addimagesmystyles');
            addInput?.click();
        }

    }
    removeImageMystyleimages(index: number) {
      const imagesArray = this.addVariantForm.get('mystyle') as FormArray;
      const files = this.getFileKeysMyStyles();
      if (index >= 0 && index < files.length) {
          const fileToRemove = files[index];
          this.mystyleImagesMap.delete(fileToRemove);
          imagesArray.removeAt(index);
      }
    }
    convertFileToUrlMyStyles(file: File) {
      const reader = new FileReader();

      reader.onload = (event) => {
          this.mystyleImagesMap.set(file, event.target?.result as string);
      };

      reader.readAsDataURL(file);
    }

    handleFileInputMyStyles(event: any) {
        const imagesArray = this.addVariantForm.get('mystyle') as FormArray;
        const files = event.target.files;

        if (files.length + imagesArray.length > 1) {
        
            const errorDataforProduct = {
                head: 'Add Image',
                sub: 'Image must be no more than 1',
            };
        
            this.WarningToast(errorDataforProduct);

            for (let i = 0; i < Math.min(files.length, 1); i++) {
                const file = files[i];

                this.checkImageResolution(file, (width, height, fileName) => {
                    if (width < 720 || height < 1080) {
                        this.imageResolutionStates[fileName] = true;
                    } else if(width > 2560 || height > 1440){
                        this.imageResolutionStates[fileName] = true;
                    } else {
                        this.imageResolutionStates[fileName] = false;
                    }
                });
                imagesArray.push(this.formBuilder.control(file));
                this.convertFileToUrlMyStyles(file);

            }

        }else{

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                this.checkImageResolution(file, (width, height, fileName) => {
                    if (width < 720 || height < 1080) {
                        this.imageResolutionStates[fileName] = true;
                    } else if(width > 2560 || height > 1440){
                        this.imageResolutionStates[fileName] = true;
                    } else {
                        this.imageResolutionStates[fileName] = false;
                    }
                });

                imagesArray.push(this.formBuilder.control(file));
                this.convertFileToUrlMyStyles(file);
            }

        }

    }
    unshowToolTip(file: File){
        this.checkImageResolution(file, (width, height, fileName) => {
            if (width < 720 || height < 1080) {
                this.imageResolutionStatesTooltip[fileName] =  false;
            } else if(width > 2560 || height > 1440){
                this.imageResolutionStatesTooltip[fileName] = false;
            } else {
                this.imageResolutionStatesTooltip[fileName] = false;
            }
        });
    }

    getFileKeysMyStyles(): File[] {
      return Array.from(this.mystyleImagesMap.keys());
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

      // this.orderService.patchOrderReturnConfirm(formData).subscribe({
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


    onImgSubmit(){
      const img = this.addVariantForm.get('mystyle')?.value
      let formData: any = new FormData();

      for (let image of img) {
        formData.append(`upload`, image);
      }

      // formData.forEach((value: any, key: any) => {
      //   console.log(`${key}: ${value}`);
      // });

      // this.orderService.postImgForReturn(formData).subscribe({
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
