import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ProvinceCityService } from 'src/app/services/province-city/province-city.service';
import { Province } from 'src/assets/models/province-city';

@Component({
  selector: 'app-shipping-fee-form',
  templateUrl: './shipping-fee-form.component.html',
  styleUrls: ['./shipping-fee-form.component.css']
})
export class ShippingFeeFormComponent {

  constructor(private province: ProvinceCityService) {}

  @ViewChild('tooltip') tooltip: ElementRef;
  provinces: Province[] = []
  selectedProvinces: Province[] = [];
  provinceSelect: Province = {
    name: '',
    key: '',
    region: ''
  };

  shippingFeeForm = new FormGroup({
    scope: new FormControl('general', Validators.required),
    //provinces: new FormControl('', Validators.required),
    price: new FormControl(1, Validators.required)
  })

  get shippingScope() { return this.shippingFeeForm.get('scope') }
  get shippingPrice() { return this.shippingFeeForm.get('price') }

  
  ngAfterViewInit(): void {
    let tooltipInit = new bootstrap.Tooltip(this.tooltip.nativeElement);
    tooltipInit.enable();

    let prov = this.province.getProvinces()
    prov.subscribe((response: Province[]) => {
      this.provinces = response.sort((a, b) => a.name.localeCompare(b.name));
    })
  }

  changeProvSelect(province: Province): void {
    this.provinceSelect = province;
  }

  addProvince(): void {
    console.log(this.provinceSelect.name);
    if(this.provinceSelect) {
      this.selectedProvinces.push(this.provinceSelect);
    }
  }

  removeProvince(province: Province): void {
    let index = this.selectedProvinces.findIndex(prov => prov == province);
    this.selectedProvinces.splice(index, 1);
  }

  postShippingFee(): void {
    let formdata = new FormData();
    formdata.append('scope', String(this.shippingScope?.value));
    formdata.append('price', String(this.shippingPrice?.value));

    if(this.shippingScope?.value == 'specific'){
      this.selectedProvinces.forEach(province => {
        formdata.append('provinces[]', province.name)
      })
    }

    console.log(formdata);
  }
} 
