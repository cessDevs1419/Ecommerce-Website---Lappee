import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { DeliveryinfoService } from 'src/app/services/delivery/deliveryinfo.service';
import { filterDeliveryInfo, formatDeliveryInfo, findDeliveryInfo } from 'src/app/utilities/response-utils';
import { DeliveryInfo } from 'src/assets/models/deliveryinfo';
import { User } from 'src/assets/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isEditMode: boolean = false;
  isSubmitEdit: boolean = false; 
  user: Observable<User> = this.accountService.getLoggedUser();
  infos!: Observable<DeliveryInfo[]>;
  isInfoRegistered!: boolean
  filteredInfo!: Observable<DeliveryInfo | null>
  //fullName: string = this.user.fname + " " + (this.user.mname ? this.user.mname : "") + " " + this.user.lname + " " + (this.user.suffix ? this.user.suffix : "");
  
  editProfileForm = new FormGroup({
    editProvince: new FormControl('', Validators.required),
    editCity: new FormControl('', Validators.required),
    editAddressLine: new FormControl('', Validators.required),
    editZipCode: new FormControl('', Validators.required),
    editPhoneNumber: new FormControl('', Validators.required)
  });

  get editProvince() { return this.editProfileForm.get('editProvince')}
  get editCity() { return this.editProfileForm.get('editCity')}
  get editAddressLine() { return this.editProfileForm.get('editAddressLine')}
  get editZipCode() { return this.editProfileForm.get('editZipCode')}
  get editPhoneNumber() { return this.editProfileForm.get('editPhoneNumber')}

  toastTheme!: string;
  toastHeader!: string;
  toastContent!: string;
  @ViewChild(ToastComponent) toast: ToastComponent;

  constructor(private accountService: AccountsService, private router: Router, private deliveryinfoService: DeliveryinfoService) {}
  

  ngOnInit(): void {
    this.checkAddress();
  }

  checkAddress(): void {
    this.infos = this.deliveryinfoService.getDeliveryInfo().pipe(map((response: any) => formatDeliveryInfo(response)));
    this.user.subscribe({
      next: (response: any) => {
        findDeliveryInfo(response.user_id, this.infos).subscribe({
          next: (match: boolean) => {
            if(match) {
              console.log('has matching address')
              this.isInfoRegistered = true;
              this.filteredInfo = filterDeliveryInfo(response.user_id, this.infos);
              this.filteredInfo.subscribe({
                next: (info: DeliveryInfo | null) => {
                  if(info){
                    this.isSubmitEdit = true;
                    this.editProfileForm.patchValue({
                      editProvince: info.city,
                      editCity: info.province,
                      editAddressLine: info.address_line_1,
                      editZipCode: info.zip_code.toString(),
                      editPhoneNumber: info.number
                    })
                  }
                  else {
                    this.isSubmitEdit = false;
                  }
                }
              });
            }
            else {
              console.log('no matching address')
              this.isInfoRegistered = false;
            }
          },
          error: (err: HttpErrorResponse) => {
            console.log(err)
          }
        })
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }

  submitAddress(): void {
    if(this.editProfileForm.valid){

      let formData: any = new FormData();
      formData.append('address_line_1', this.editAddressLine?.value);
      formData.append('address_line_2', '');
      formData.append('city', this.editCity?.value);
      formData.append('province', this.editProvince?.value);
      formData.append('zip_code', this.editZipCode?.value);
      formData.append('number', this.editPhoneNumber?.value);

      console.log(formData);

      if(!this.isSubmitEdit) {
        this.deliveryinfoService.postDeliveryInfo(formData).subscribe({
          next: (response: any) => {
            this.toastHeader = "Successfully added!";
            this.toastContent = "Your delivery information has been updated.";
            this.toast.switchTheme('default');
            this.toast.show();
          },
          error: (err: HttpErrorResponse) => {
            console.log(err)
            this.toastHeader = "Action failed!";
            this.toastContent = "Please try again in a few moments.";
            this.toast.switchTheme('negative');
            this.toast.show();
          },
          complete: () => {
            this.isEditMode = false;
            this.checkAddress();
          }
        })
      }
      else {
        this.deliveryinfoService.patchDeliveryInfo(formData).subscribe({
          next: (response: any) => {
            this.toastHeader = "Successfully edited!";
            this.toastContent = "Your delivery information has been updated.";
            this.toast.switchTheme('default');
            this.toast.show();
          },
          error: (err: HttpErrorResponse) => {
            console.log(err)
            this.toastHeader = "Action failed!";
            this.toastContent = "Please try again in a few moments.";
            this.toast.switchTheme('negative');
            this.toast.show();
          },
          complete: () => {
            this.isEditMode = false;
            this.checkAddress();
          }
        })
      }

    }
    else {
      this.editProfileForm.markAllAsTouched();
    }
  }

  logout(): void {
    this.accountService.logoutUser().subscribe({
      next: (response: any) => {
        console.log(response);
        this.accountService.checkLoggedIn().subscribe();
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

}