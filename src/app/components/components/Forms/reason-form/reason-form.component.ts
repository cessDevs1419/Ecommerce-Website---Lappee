import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reason-form',
  templateUrl: './reason-form.component.html',
  styleUrls: ['./reason-form.component.css']
})
export class ReasonFormComponent {
  @Output() OrderSuccess: EventEmitter<any> = new EventEmitter();
  @Output() OrderWarn: EventEmitter<any> = new EventEmitter();
  @Output() OrderError: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Output() ship: EventEmitter<any> = new EventEmitter();
  @Output() CloseModal: EventEmitter<any> = new EventEmitter();
  @Output() RefreshTable: EventEmitter<void> = new EventEmitter();

  inputColor: string = "text-white"
  borderColor: string = "border-grey"
  textcolor: string = 'text-light-subtle'
  bordercolor: string = 'dark-subtle-borders'
  titleColor : string = 'dark-theme-text-color';
  itemColor: string = 'text-white-50';
  selectedReason: string = '';

  @Input() selectedRowData!: any;
  @Input() formAddReason!: boolean;

  addReason: FormGroup;

  constructor(){
    this.addReason = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
    });
  }

  addReasonSubmit(){
    const name = this.addReason.get('name')?.value
    const description = this.addReason.get('description')?.value
    console.log(name, description)
  }
}
