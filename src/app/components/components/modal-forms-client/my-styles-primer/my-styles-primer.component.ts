import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-my-styles-primer',
  templateUrl: './my-styles-primer.component.html',
  styleUrls: ['./my-styles-primer.component.css']
})
export class MyStylesPrimerComponent {

  @Output() dismiss = new EventEmitter<boolean>();

  dontShowAgain: FormGroup = new FormGroup({
    dontShow: new FormControl(false)
  })

  get dontShow() { return this.dontShowAgain.get('dontShow') }

  dismissModal(): void {
    if(this.dontShow?.value) {
      console.log(true)
      this.dismiss.emit(true)
    }
    else {
      console.log(false)
      this.dismiss.emit(false)
    }
  }
}
