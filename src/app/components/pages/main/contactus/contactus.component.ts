import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent {

  contactusForm = new FormGroup({
    contactusName: new FormControl('', Validators.required),
    contactusEmail: new FormControl('', Validators.required),
    contactusMsg: new FormControl('', Validators.required)
  })

  get contactusName() { return this.contactusForm.get('contactusName')}
  get contactusEmail() { return this.contactusForm.get('contactusEmail')}
  get contactusMsg() { return this.contactusForm.get('contactusMsg')}

  submit() {
    if(this.contactusForm.valid){

    }
    else {
      this.contactusForm.markAllAsTouched();
    }
  }
}
