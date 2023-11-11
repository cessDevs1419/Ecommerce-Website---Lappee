import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { InquiryService } from 'src/app/services/inquiry/inquiry.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent {

  toastTheme!: string;
  toastHeader!: string;
  toastContent!: string;
  @ViewChild(ToasterComponent) toaster: ToasterComponent;

  contactusForm = new FormGroup({
    contactusName: new FormControl('', Validators.required),
    contactusEmail: new FormControl('', Validators.required),
    contactusMsg: new FormControl('', Validators.required)
  })

  get contactusName() { return this.contactusForm.get('contactusName')}
  get contactusEmail() { return this.contactusForm.get('contactusEmail')}
  get contactusMsg() { return this.contactusForm.get('contactusMsg')}

  constructor(private inquiryService: InquiryService) {}

  submit() {
    if(this.contactusForm.valid){
      let formData: any = new FormData();
      formData.append('name', this.contactusName?.value);
      formData.append('email', this.contactusEmail?.value);
      formData.append('message', this.contactusMsg?.value);

      console.log(formData);

      this.inquiryService.postInquiry(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.toaster.showToast("Successfully added!", "Your inquiry has been sent.");
          this.contactusForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.toaster.showToast("Action failed!","Please try again in a few moments.", 'negative');
        }
      })

    }
    else {
      this.contactusForm.markAllAsTouched();
    }
  }
}
