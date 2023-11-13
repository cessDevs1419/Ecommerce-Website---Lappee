import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.css']
})
export class CancelOrderComponent {

  @Input() order: string = ""

  @Output() activateToast = new EventEmitter<string[]>();
  @Output() dismiss = new EventEmitter();
  @Output() emitCancel = new EventEmitter<{id: string, reason: string}>();

  reasonForm = new FormGroup ({
    reason: new FormControl('', Validators.required),
  });

  hideReasonInput: boolean = true;

  get reason() { return this.reasonForm.get('reason') }

  handleDismiss(): void {
    this.dismiss.emit()
  }

  emit(): void {
    if(this.reasonForm.valid && this.reason?.value){
      console.log('emitting from delete case');
      this.emitCancel.emit({id: this.order, reason: this.reason.value});
      this.handleDismiss();
    }
    else {
      this.reasonForm.markAllAsTouched();
    }
  }
}
