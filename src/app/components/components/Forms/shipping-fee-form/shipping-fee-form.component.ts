import { Component, ElementRef, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ProvinceCityService } from 'src/app/services/province-city/province-city.service';
import { Province } from 'src/assets/models/province-city';
import { Output } from '@angular/core';
import { ShippingFee } from 'src/assets/models/shipping';

@Component({
  selector: 'app-shipping-fee-form',
  templateUrl: './shipping-fee-form.component.html',
  styleUrls: ['./shipping-fee-form.component.css']
})
export class ShippingFeeFormComponent {

  constructor(private province: ProvinceCityService) {}

  @Output() closeModal: EventEmitter<any>  = new EventEmitter<any>();
  @Output() deleteShippingFee: EventEmitter<any> = new EventEmitter<any>();

  @Input() editShipping: ShippingFee;
  @Input() viewShipping: ShippingFee;
  @Input() deleteShipping: ShippingFee;
  @Input() modeView: boolean;
  @Input() modeAdd: boolean;
  @Input() modeEdit: boolean;
  @Input() modeDelete: boolean;

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
  isSelectedProvincesEmpty: boolean;

  get shippingScope() { return this.shippingFeeForm.get('scope') }
  get shippingPrice() { return this.shippingFeeForm.get('price') }

  ngOnInit(): void {
    if(this.editShipping){
      this.shippingFeeForm.patchValue({
        scope: this.editShipping.scope,
        price: Number(this.editShipping.price)
      })

    }
  }
  
  ngAfterViewInit(): void {
    let tooltipInit = new bootstrap.Tooltip(this.tooltip.nativeElement);
    tooltipInit.enable();

    let prov = this.province.getProvinces()
    prov.subscribe((response: Province[]) => {
      this.provinces = response.sort((a, b) => a.name.localeCompare(b.name));

      if(this.editShipping && this.editShipping.scope == 'specific'){
        this.editShipping.provinces?.forEach((name: string) => {
          this.selectedProvinces.push(this.provinces.find((province) => province.name == name)!)
        })
      }
    })
  }

  changeProvSelect(province: Province): void {
    this.provinceSelect = province;
  }

  addProvince(): void {
    console.log(this.provinceSelect.name);
    if(this.provinceSelect && this.provinceSelect.name) {
      this.selectedProvinces.push(this.provinceSelect);
    }
  }

  removeProvince(province: Province): void {
    let index = this.selectedProvinces.findIndex(prov => prov == province);
    this.selectedProvinces.splice(index, 1);
  }

  postShippingFee(): void {
    if(this.shippingFeeForm.valid){
      let formdata = new FormData();
      formdata.append('scope', String(this.shippingScope?.value));
      formdata.append('price', String(this.shippingPrice?.value));
  
      if(this.shippingScope?.value == 'specific'){
        if(this.selectedProvinces.length > 0){
          this.selectedProvinces.forEach(province => {
            formdata.append('provinces[]', province.name)
          })
        }
        else {
          this.isSelectedProvincesEmpty = true;
        }
      }
      
      console.log(formdata);
      this.closeModalAndReset();
    }
    else {
      this.shippingFeeForm.markAllAsTouched();
    }
      
  }

  closeModalAndReset(): void {
      this.closeModal.emit();
      if(this.modeAdd){
        this.shippingFeeForm.reset();
        this.shippingFeeForm.patchValue({
          scope: 'general',
          price: 1
        });
        this.selectedProvinces = [];
      }
  }

  emitShippingDelete(): void {
    this.deleteShippingFee.emit(this.deleteShipping.id);
    this.closeModalAndReset();
  }
} 
