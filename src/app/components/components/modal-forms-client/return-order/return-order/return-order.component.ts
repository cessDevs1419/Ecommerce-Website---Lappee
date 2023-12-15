import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-return-order',
  templateUrl: './return-order.component.html',
  styleUrls: ['./return-order.component.css']
})
export class ReturnOrderComponent {
  @Input() order: string = ""

  @Output() activateToast = new EventEmitter<string[]>();
  @Output() dismiss = new EventEmitter();
  @Output() emitReturn = new EventEmitter<{id: string, reason: string}>();

  reasonForm = new FormGroup ({
    reason: new FormControl('', Validators.required),
  });

  hideReasonInput: boolean = true;

  get reason() { return this.reasonForm.get('reason') }

  handleDismiss(): void {
    this.dismiss.emit()
  }

  emit(): void {
    if(this.reasonForm.valid && this.reason!.value!.length > 9){
      console.log('emitting from delete case');
      this.emitReturn.emit({id: this.order, reason: this.reason!.value!});
      this.handleDismiss();
    }
    else {
      this.reasonForm.markAllAsTouched();
    }
  }
}
