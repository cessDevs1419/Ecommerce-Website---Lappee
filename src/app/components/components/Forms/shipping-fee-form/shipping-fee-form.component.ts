import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validateOptions } from 'pusher-js/types/src/core/options';

@Component({
  selector: 'app-shipping-fee-form',
  templateUrl: './shipping-fee-form.component.html',
  styleUrls: ['./shipping-fee-form.component.css']
})
export class ShippingFeeFormComponent {

  shippingFeeForm = new FormGroup({
    scope: new FormControl('', Validators.required),
    provinces: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required)
  })

  
}
