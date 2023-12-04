import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, map, of, tap } from 'rxjs';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { InquiryService } from 'src/app/services/inquiry/inquiry.service';
import { formatInquiries, formatInquiryContent } from 'src/app/utilities/response-utils';
import { Inquiry, InquiryList, Replies } from 'src/assets/models/inquiry';

@Component({
  selector: 'app-admin-inquiry',
  templateUrl: './admin-inquiry.component.html',
  styleUrls: ['./admin-inquiry.component.css'],
})
export class AdminInquiryComponent {
  inquiries!: Observable<Inquiry[]>;
  @ViewChild(TableComponent) table: TableComponent;
  @ViewChild(ToasterComponent) toaster: ToasterComponent;
  @ViewChild('closeBtn') close: ElementRef
  titleColor: string = 'color-adm-light-gray';
  textColor: string = 'text-secondary';
  borderColor: string = '';
  backGround: string = '';
  btncolor: string = 'btn-primary glow-primary'
  size: string = 'w-100';
  private refreshData$ = new Subject<void>();
  
  inquiryContent: Inquiry = {
    id: '',
    email: '',
    name: '',
    message: '',
    created_at: '',
    updated_at: '',
    is_read: false,
  };
  
  replyContent: Replies[] = []

  selectedRowData:any;
  InquiryForm: FormGroup;

  constructor(
    private inquiryService: InquiryService,
    private router:  Router,
    private formBuilder: FormBuilder,
  ) {

    this.InquiryForm = new FormGroup({
      message: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.inquiries = this.inquiryService.getInquiry().pipe(
      map((response: any) => formatInquiries(response)),
      tap(() => {
          this.table.loaded()
      })
      
    );
  }
  refreshTableData(): void {
    this.refreshData$.next();
  }

  getRowData(rowData: any)
  {
    this.selectedRowData = rowData;

    this.inquiryService.getInquiryById(this.selectedRowData.id).subscribe({
      next: (response: any) => {
        const data = formatInquiryContent(response);
        this.inquiryContent = data.inquiry;
        this.replyContent = data.replies
        console.log(data)
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  send(){

    const messageValue = this.InquiryForm.get('message')?.value; 

    let formData: FormData = new FormData(); 
    formData.append('inquiry_id', this.selectedRowData.id);
    formData.append('message', messageValue);

    // formData.forEach((value, key) => {
    //     console.log(`${key}: ${value}`);
    // });
    
    this.inquiryService.postReplyInquiry(formData).subscribe({
        next: (response: any) => { 
            const successMessage = {
                head: 'Inquiry Management',
                sub: response?.message
            };
            

            this.refreshTableData();
            this.SuccessToast(successMessage);
            this.InquiryForm.reset()
            this.close.nativeElement.click()

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
                            errorMessage = messages.join(' '); // Concatenate error messages into a single string
                        }
                        errorsArray.push(errorMessage);
                    }
                }
            
                const errorDataforProduct = {
                    head: 'Error Invalid Inputs',
                    sub: errorsArray,
                };
            
                this.WarningToast(errorDataforProduct);
            } else {
            
                const errorDataforProduct = {
                    head: 'Error Invalid Inputs',
                    sub: 'Please Try Another One',
                };
                this.WarningToast(errorDataforProduct);
            }
            
            // return throwError(() => error);
            
        }
    });
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
