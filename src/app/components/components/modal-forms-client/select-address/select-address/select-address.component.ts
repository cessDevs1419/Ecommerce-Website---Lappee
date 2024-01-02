import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { error } from 'jquery';
import { Validators } from 'ngx-editor';
import { map } from 'rxjs';
import { DeliveryinfoService } from 'src/app/services/delivery/deliveryinfo.service';
import { formatAddressList } from 'src/app/utilities/response-utils';
import { Address } from 'src/assets/models/deliveryinfo';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.css']
})
export class SelectAddressComponent {

  constructor(private deliveryInfoService: DeliveryinfoService) {}

  @Input() addresses: Address[];
  @Output() emitAddressSelect = new EventEmitter<string>();
  @Output() dismiss = new EventEmitter<any>();

  activeAddressId: string = '';

  selectedAddressForm = new FormGroup({
    address: new FormControl('', Validators.required())
  })
  
  ngOnInit(): void {
    if(!this.addresses) {
      let data = this.deliveryInfoService.getAddressList().pipe(map((response: any) => formatAddressList(response)))
      data.subscribe({
        next: (addresses: Address[]) => {
         // console.log(addresses)
          this.addresses = addresses;
          this.setupAddress();
        },
        error: (err: HttpErrorResponse) => {
         // console.log(err)
        }
      })
    }
    else {
      this.setupAddress();
    }
  }

  setupAddress(): void {
    let active = this.addresses.find((address: Address) => address.in_use == 1)
    this.activeAddressId = active?.id!
    this.selectedAddressForm.patchValue({
      address: active?.id
    })
  }

  selectAddress(id: string): void {
    this.emitAddressSelect.emit(id);
  }

  changeActive(id: string) {
    this.activeAddressId = id;
  }

  dismissModal(): void {
    this.dismiss.emit()
  }

  changeActiveAddress() {
    this.emitAddressSelect.emit(this.activeAddressId);
    this.dismissModal();
  }
}
