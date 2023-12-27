import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
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
  isEditMode: boolean = false;
  isSubmitEdit: boolean = false; 
  isNameEditable: boolean = true;
  user: Observable<User> = this.accountService.getLoggedUser();
  infos!: Observable<DeliveryInfo[]>;
  userAddresses: Address[];
  isInfoRegistered!: boolean
  filteredInfo!: Observable<DeliveryInfo[]>
  //fullName: string = this.user.fname + " " + (this.user.mname ? this.user.mname : "") + " " + this.user.lname + " " + (this.user.suffix ? this.user.suffix : "");
  
  editProfileForm = new FormGroup({
    editFirstName: new FormControl('', Validators.required),
    editMiddleName: new FormControl(''),
    editLastName: new FormControl('', Validators.required),
    editSuffix: new FormControl(''),
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
  get editFirstName() { return this.editProfileForm.get('editFirstName') }
  get editMiddleName() { return this.editProfileForm.get('editMiddleName') }
  get editLastName() { return this.editProfileForm.get('editLastName') }
  get editSuffix() { return this.editProfileForm.get('editSuffix') }

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
        this.editProfileForm.patchValue({
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

        findDeliveryInfo(response.user_id, this.infos).subscribe({
          next: (match: boolean) => {
            if(match) {
              console.log('has matching address')
              this.isInfoRegistered = true;
              this.filteredInfo = filterDeliveryInfo(response.user_id, this.infos);
              this.filteredInfo.subscribe({
                next: (info: DeliveryInfo[]) => {
                  if(info){
                    this.isSubmitEdit = true;
                    this.editProfileForm.patchValue({
                      editProvince: info[0].city,
                      editCity: info[0].province,
                      editAddressLine: info[0].address,
                      editZipCode: info[0].zip_code.toString(),
                      editPhoneNumber: info[0].number
                    })
                    if(response.fname && response.lname) {
                      this.editProfileForm.patchValue({
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
                  }
                  else {
                    this.isSubmitEdit = false;
                  }
                }
              });
            }
            else {
              this.filteredInfo = filterDeliveryInfo(response.user_id, this.infos);
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
      formData.append('address', this.editAddressLine?.value);
      formData.append('city', this.editCity?.value);
      formData.append('province', this.editProvince?.value);
      formData.append('zip_code', this.editZipCode?.value);
      formData.append('number', this.editPhoneNumber?.value);

      console.log(formData);

      if(!this.isSubmitEdit) {
        formData.append('first_name', this.editFirstName?.value);
        formData.append('middle_name', this.editMiddleName?.value ? this.editMiddleName?.value : '');
        formData.append('last_name', this.editLastName?.value);
        formData.append('suffix', this.editSuffix?.value ? this.editSuffix?.value : '');

        this.deliveryinfoService.postDeliveryInfo(formData).subscribe({
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
            })
          }
        })
      }
      else {
        this.deliveryinfoService.patchDeliveryInfo(formData).subscribe({
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
            })
            
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
        this.echo.disconnect();
        this.accountService.checkLoggedIn().subscribe();
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

}