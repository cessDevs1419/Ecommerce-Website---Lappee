import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-group-form',
  templateUrl: './product-group-form.component.html',
  styleUrls: ['./product-group-form.component.css']
})
export class ProductGroupFormComponent {
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
  @Input() formAddProductGroup!: boolean;
}
