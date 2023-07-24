import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { AddressService } from 'src/app/services/address/address.service';
import { filterAddresses, findAddresses, formatAddress } from 'src/app/utilities/response-utils';
import { Address } from 'src/assets/models/address';
import { User } from 'src/assets/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isEditMode: boolean = false;
  user: Observable<User> = this.accountService.getLoggedUser();
  addresses!: Observable<Address[]>;
  isAddressRegistered!: boolean
  filteredAddress!: Observable<Address | null>
  //fullName: string = this.user.fname + " " + (this.user.mname ? this.user.mname : "") + " " + this.user.lname + " " + (this.user.suffix ? this.user.suffix : "");
  
  editProfileForm = new FormGroup({
    editProvince: new FormControl('', Validators.required),
    editCity: new FormControl('', Validators.required),
    editAddressLine: new FormControl('', Validators.required),
    editZipCode: new FormControl('', Validators.required)
  });

  get editProvince() { return this.editProfileForm.get('editProvince')}
  get editCity() { return this.editProfileForm.get('editCity')}
  get editAddressLine() { return this.editProfileForm.get('editAddressLine')}
  get editZipCode() { return this.editProfileForm.get('editZipCode')}

  toastTheme!: string;
  toastHeader!: string;
  toastContent!: string;
  @ViewChild(ToastComponent) toast: ToastComponent;

  constructor(private accountService: AccountsService, private router: Router, private addressService: AddressService) {}
  

  ngOnInit(): void {
    this.checkAddress();
  }

  checkAddress(): void {
    this.addresses = this.addressService.getAddresses().pipe(map((response: any) => formatAddress(response)));
    this.user.subscribe({
      next: (response: any) => {
        findAddresses(response.user_id, this.addresses).subscribe({
          next: (match: boolean) => {
            if(match) {
              console.log('has matching address')
              this.isAddressRegistered = true;
              this.filteredAddress = filterAddresses(response.user_id, this.addresses);
              this.filteredAddress.subscribe({
                next: (address: Address | null) => {
                  if(address){
                    this.editProfileForm.patchValue({
                      editProvince: address.city,
                      editCity: address.province,
                      editAddressLine: address.address_line_1,
                      editZipCode: address.zip_code.toString()
                    })
                  }
                }
              });
            }
            else {
              console.log('no matching address')
              this.isAddressRegistered = false;
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

      console.log(formData);

      this.addressService.postAddress(formData).subscribe({
        next: (response: any) => {
          this.toastHeader = "Successful!";
          this.toastContent = "Your address has been updated.";
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
        }
      })
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
