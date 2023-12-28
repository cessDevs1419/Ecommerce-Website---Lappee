import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { ModalClientComponent } from 'src/app/components/components/modal-client/modal-client.component';
import { ToastComponent } from 'src/app/components/components/toast/toast.component';
import { ToasterComponent } from 'src/app/components/components/toaster/toaster/toaster.component';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { DeliveryinfoService } from 'src/app/services/delivery/deliveryinfo.service';
import { EchoService } from 'src/app/services/echo/echo.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { ProvinceCityService } from 'src/app/services/province-city/province-city.service';
import { filterDeliveryInfo, formatDeliveryInfo, findDeliveryInfo, formatAddressList } from 'src/app/utilities/response-utils';
import { Address, DeliveryInfo } from 'src/assets/models/deliveryinfo';
import { City, Province } from 'src/assets/models/province-city';
import { User } from 'src/assets/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  // modal variables
  mode: string = "";
  modalSize: string = '';
  deleteTargetId: string = '';
  @ViewChild(ModalClientComponent) modal: ModalClientComponent;

  isEditMode: boolean = false;

  isSubmitEdit: boolean = false; 
  isNameEditable: boolean = true;

  addAddress: boolean = false;
  editAddress: boolean = false;
  addName: boolean = false;

  targetAddress: Address;

  user: Observable<User> = this.accountService.getLoggedUser();
  infos!: Observable<DeliveryInfo[]>;
  userAddresses: Address[];
  isInfoRegistered!: boolean
  filteredInfo!: Observable<DeliveryInfo[]>
  //fullName: string = this.user.fname + " " + (this.user.mname ? this.user.mname : "") + " " + this.user.lname + " " + (this.user.suffix ? this.user.suffix : "");
  
  editAddressForm = new FormGroup({
    editProvince: new FormControl('', Validators.required),
    editCity: new FormControl('', Validators.required),
    editAddressLine: new FormControl('', Validators.required),
    editZipCode: new FormControl('', Validators.required),
    editPhoneNumber: new FormControl('', Validators.required),
    editLabel: new FormControl('', Validators.required)
  });
  
  editNameForm = new FormGroup({
    editFirstName: new FormControl('', Validators.required),
    editMiddleName: new FormControl(''),
    editLastName: new FormControl('', Validators.required),
    editSuffix: new FormControl(''),
  })

  get editProvince() { return this.editAddressForm.get('editProvince')}
  get editCity() { return this.editAddressForm.get('editCity')}
  get editAddressLine() { return this.editAddressForm.get('editAddressLine')}
  get editZipCode() { return this.editAddressForm.get('editZipCode')}
  get editPhoneNumber() { return this.editAddressForm.get('editPhoneNumber')}
  get editLabel() { return this.editAddressForm.get('editLabel')}
  get editFirstName() { return this.editNameForm.get('editFirstName') }
  get editMiddleName() { return this.editNameForm.get('editMiddleName') }
  get editLastName() { return this.editNameForm.get('editLastName') }
  get editSuffix() { return this.editNameForm.get('editSuffix') }

  toastTheme!: string;
  toastHeader!: string;
  toastContent!: string;
  @ViewChild(ToasterComponent) toaster: ToasterComponent;

  provinces: Province[];
  cities: City[];

  constructor(private accountService: AccountsService, private router: Router, private deliveryinfoService: DeliveryinfoService, private provinceCity: ProvinceCityService, private eh: ErrorHandlerService, private echo: EchoService) {}
  

  ngOnInit(): void {
    console.log(this.provinceCity.cities);
    this.initProvinceCity();
    this.checkAddress();
  }

  ngOnChanges(): void {
    this.initProvinceCity()
    console.log(this.provinces)
  }

  initProvinceCity(): void {
    let prov = this.provinceCity.getProvinces()
    prov.subscribe((response: Province[]) => {
      this.provinces = response.sort((a, b) => a.name.localeCompare(b.name));
    })
    let city = this.provinceCity.getCities();
    city.subscribe((response: City[]) => {
      this.cities = response.sort((a, b) => a.name.localeCompare(b.name));
    })
  }

  filterCity(): City[] {
    let provinceSelected = this.editProvince?.value;
    
    if(provinceSelected){
      let match = this.provinces.find((province) => province.name == provinceSelected);
      let key = match?.key;

      return this.cities.filter((city) => city.province == key)
    }

    return this.cities;
  }

  checkAddress(): void {
    this.infos = this.deliveryinfoService.getDeliveryInfo().pipe(map((response: any) => formatDeliveryInfo(response)));
    this.user = this.accountService.getLoggedUser();
    this.user.subscribe({
      next: (response: any) => {

        let addresses = this.deliveryinfoService.getAddressList().pipe(map((response: any) => formatAddressList(response)));
        addresses.subscribe({
          next: (addresses: Address[]) => {
            if(addresses) {
              this.isInfoRegistered = true;
              this.userAddresses = addresses;
            }
            else {
              this.isInfoRegistered = false;
            }
          },
          error: (err: HttpErrorResponse) => {
            this.eh.handle(err)
          }
      })

      if(response.fname && response.lname) {
        this.editNameForm.patchValue({
          editFirstName: response.fname,
          editLastName: response.lname,
          editMiddleName: response.mname,
          editSuffix: response.suffix
        })
        this.editFirstName?.disable();
        this.editLastName?.disable();
        this.editMiddleName?.disable();
        this.editSuffix?.disable();
      }
       // this.userAddresses = this.deliveryinfoService.getAddressList().pipe(map((response: any) => formatAddressList(response)));

        // findDeliveryInfo(response.user_id, this.infos).subscribe({
        //   next: (match: boolean) => {
        //     if(match) {
        //       console.log('has matching address')
        //       this.isInfoRegistered = true;
        //       this.filteredInfo = filterDeliveryInfo(response.user_id, this.infos);
        //       this.filteredInfo.subscribe({
        //         next: (info: DeliveryInfo[]) => {
        //           if(info){
        //             this.isSubmitEdit = true;
        //             this.editProfileForm.patchValue({
        //               editProvince: info[0].city,
        //               editCity: info[0].province,
        //               editAddressLine: info[0].address,
        //               editZipCode: info[0].zip_code.toString(),
        //               editPhoneNumber: info[0].number
        //             })
        //             if(response.fname && response.lname) {
        //               this.editProfileForm.patchValue({
        //                 editFirstName: response.fname,
        //                 editLastName: response.lname,
        //                 editMiddleName: response.mname,
        //                 editSuffix: response.suffix
        //               })
        //               this.editFirstName?.disable();
        //               this.editLastName?.disable();
        //               this.editMiddleName?.disable();
        //               this.editSuffix?.disable();
        //             }
        //           }
        //           else {
        //             this.isSubmitEdit = false;
        //           }
        //         }
        //       });
        //     }
        //     else {
        //       this.filteredInfo = filterDeliveryInfo(response.user_id, this.infos);
        //       console.log('no matching address')
        //       this.isInfoRegistered = false;
        //     }
        //   },
        //   error: (err: HttpErrorResponse) => {
        //     console.log(err)
        //   }
        // })
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }


  cancelSubmitAddress(): void {
    this.isEditMode = false;
    this.addAddress = false;
    this.editAddress = false;

    this.editAddressForm.reset();
  }

  submitName(): void {
    if(this.editNameForm.valid){
      let formData: any = new FormData();
      formData.append('first_name', this.editFirstName?.value);
      formData.append('middle_name', this.editMiddleName?.value);
      formData.append('last_name', this.editLastName?.value);
      formData.append('suffix', this.editSuffix?.value);
  
      this.deliveryinfoService.postAddName(formData).subscribe({
        next: (response: any) => {
          this.toaster.showToast("Successfully added!", "Your name has been updated.")
          this.checkAddress();
        },
        error: (err: HttpErrorResponse) => {
          this.eh.handle(err)
        },
        complete: () => {
          this.accountService.checkLoggedIn().subscribe((status: boolean) => {
            if(status){
              this.user = this.accountService.getLoggedUser();
              this.checkAddress();
            }
            
            this.isEditMode = false;
            this.addName = false;
          })
        }
      })
    }
    else {
      this.editNameForm.markAllAsTouched();
    }
  }

  submitAddress(): void {
    if(this.editAddressForm.valid){
      let formData: any = new FormData();
      formData.append('address', this.editAddressLine?.value);
      formData.append('city', this.editCity?.value);
      formData.append('province', this.editProvince?.value);
      formData.append('zip_code', this.editZipCode?.value);
      formData.append('number', this.editPhoneNumber?.value);
      formData.append('label', this.editLabel?.value);

      console.log(formData);

      if(this.addAddress) {

        this.deliveryinfoService.postAddAddress(formData).subscribe({
          next: (response: any) => {

            this.toaster.showToast("Successfully added!", "Your delivery information has been updated.")
            this.checkAddress();
          },
          error: (err: HttpErrorResponse) => {
            console.log(err)
            this.toaster.showToast("Oops!", this.eh.handle(err), 'negative')
          },
          complete: () => {
            this.accountService.checkLoggedIn().subscribe((status: boolean) => {
              if(status){
                this.user = this.accountService.getLoggedUser();
                this.checkAddress();
              }
              
              this.isEditMode = false;
              this.addAddress = false;
            })
          }
        })
      }
      else {
        formData.append("id", this.targetAddress.id);

        this.deliveryinfoService.patchEditAddress(formData).subscribe({
          next: (response: any) => {

            this.toaster.showToast("Successfully edited!", "Your delivery information has been updated.")

            this.user = this.accountService.getLoggedUser();
          },
          error: (err: HttpErrorResponse) => {

            this.toaster.showToast("Oops!", this.eh.handle(err), 'negative')
          },
          complete: () => {
            
            this.accountService.checkLoggedIn().subscribe((status: boolean) => {
              if(status){
                this.user = this.accountService.getLoggedUser();
                this.checkAddress();
              }

              this.isEditMode = false;
              this.editAddress = false;
            })
          }
        })
      }

    }
    else {
      this.editAddressForm.markAllAsTouched();
    }
  }

  editAddressFormValues(address: Address): void {
    this.editAddressForm.patchValue({
      editAddressLine: address.address,
      editCity: address.city,
      editPhoneNumber: address.number,
      editProvince: address.province,
      editZipCode: String(address.zip_code),
      editLabel: address.label
    })

    this.editAddress = true;
    this.isEditMode = true;
    this.targetAddress = address;
  }

  activeNumber(): string {
    return this.userAddresses.find((address: Address) => address.in_use == 1)?.number!
  }

  logout(): void {
    this.accountService.logoutUser().subscribe({
      next: (response: any) => {
        console.log(response);
        this.echo.disconnect();
        this.accountService.checkLoggedIn().subscribe();
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  deleteModal(id: string): void {
    this.modal.confirmRemoveAddress(id);
    this.deleteTargetId = id;
  }

  deleteAddress(confirm: boolean): void {
    if(confirm){
      let formData = new FormData();
      formData.append('id', this.deleteTargetId);
  
      this.deliveryinfoService.deleteAddress(formData).subscribe({
        next: (response: any) => {
  
          this.toaster.showToast("Successfully deleted!", "Your address has been deleted.")
  
          this.user = this.accountService.getLoggedUser();
        },
        error: (err: HttpErrorResponse) => {
  
          this.toaster.showToast("Oops!", this.eh.handle(err), 'negative')
        },
        complete: () => {
          
          this.accountService.checkLoggedIn().subscribe((status: boolean) => {
            if(status){
              this.user = this.accountService.getLoggedUser();
              this.checkAddress();
            }
          })
          this.deleteTargetId = '';
        }
      })
    }
  }

}