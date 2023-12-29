import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.css']
})
export class SelectAddressComponent {
  @Output() emitAddressSelect = new EventEmitter<string>();
  @Output() dismiss = new EventEmitter<any>();

  selectAddress(id: string): void {
    this.emitAddressSelect.emit(id);
  }

  dismissModal(): void {
    this.dismiss.emit()
  }
}
