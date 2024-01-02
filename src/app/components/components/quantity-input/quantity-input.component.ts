import { Component, ElementRef, Input, ViewChild, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-quantity-input',
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuantityInputComponent),
      multi: true
    }
  ]
})
export class QuantityInputComponent implements ControlValueAccessor {
  private onChange: any = (quantity: number) => { this.quantityChange.emit(this.quantity) };
  private onTouch: any = () => {};


  @Input() max: number;
  @Input() showStock: boolean = true;
  @Input() quantity: number = 1;
  @Input() size: string = "normal";
  @Output() quantityChange: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('quantity_input') input: ElementRef;
  sizeClass: string = "";

  ngOnInit(): void {
    switch(this.size) {
      case 'normal': 
        this.sizeClass = "padding-normal";
        break;
      
      case 'small':
        this.sizeClass = "padding-small";
        break;
    }
  }


  writeValue(obj: any): void {
    this.quantity = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
   // console.log(isDisabled);
  }

  change(amount: number): void {
    if(this.quantity + amount < 1 || this.quantity + amount > this.max){
     // console.log("below 0: " + (this.quantity + amount < 1));
      //console.log("above max: " + (this.quantity + amount > this.max));
      // if amount will not go below 1 or above max value
      return;
    } 
    this.quantity += amount;
    this.onChange(this.quantity);
  }

  type(): void {
    let amount = this.input.nativeElement.value;
    if(amount > this.max) {
      this.quantity = this.max;
    }
    if(amount < 1) {
      this.quantity = 1;
    }
  }

  check(): void {
    if(this.quantity > this.max) {
      this.quantity = this.max;
      
    }
    if(this.quantity < 1) {
      this.quantity = 1;
    }

    this.onChange(this.quantity);
  }
}
