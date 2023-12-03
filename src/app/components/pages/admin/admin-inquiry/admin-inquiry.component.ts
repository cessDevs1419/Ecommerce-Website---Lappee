import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of, tap } from 'rxjs';
import { TableComponent } from 'src/app/components/components/table/table.component';
import { InquiryService } from 'src/app/services/inquiry/inquiry.service';
import { formatInquiries, formatInquiryContent } from 'src/app/utilities/response-utils';
import { Inquiry, InquiryList } from 'src/assets/models/inquiry';

@Component({
  selector: 'app-admin-inquiry',
  templateUrl: './admin-inquiry.component.html',
  styleUrls: ['./admin-inquiry.component.css'],
})
export class AdminInquiryComponent {
  inquiries!: Observable<Inquiry[]>;
  @ViewChild(TableComponent) table: TableComponent;
  titleColor: string = 'color-adm-light-gray';
  textColor: string = 'text-secondary';
  borderColor: string = '';
  backGround: string = '';
  btncolor: string = 'btn-primary glow-primary'
  size: string = 'w-100';

  inquiryContent: Inquiry = {
    id: '',
    email: '',
    name: '',
    message: '',
    created_at: '',
    updated_at: '',
    is_read: false,
  };
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

  getRowData(rowData: any)
  {
    this.selectedRowData = rowData;

    this.inquiryService.getInquiryById(this.selectedRowData.id).subscribe({
      next: (response: any) => {
        const data = formatInquiryContent(response);
        this.inquiryContent = data;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }
  send(){
    console.log(this.InquiryForm.get('message')?.value)
  }
}
