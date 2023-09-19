import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from 'src/assets/models/products';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  @Input() product!: any;
  @Input() operation: string;
  @Input() context: string = "";
  @Output() activateToast = new EventEmitter<string[]>();
  @Output() dismiss = new EventEmitter();
  @Output() emitDeleteTrue = new EventEmitter<{status: boolean, item: any}>();

  operation_output: string;

  ngOnInit(): void {
    switch(this.operation){
      case 'delete':
        this.operation_output = 'remove';
        break; 
    }
  }

  handleDismiss(): void {
    this.dismiss.emit()
  }

  emit(): void {
    console.log(this.operation);
    switch(this.operation){
      case 'delete':
        console.log('emitting from delete case');
        this.emitDeleteTrue.emit({status: true, item: this.product});
        this.handleDismiss();
        break;
    }
  }

}
