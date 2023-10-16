import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ColorService } from 'src/app/services/color/color.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]
})
export class ColorPickerComponent implements ControlValueAccessor {
  
  constructor(private colorService: ColorService) {}

  writeValue(obj: any): void {
    this.color = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    console.log(isDisabled);
  }

  @Input() showLabel: boolean = true;
  @Input() placeholder: string = "";
  @Input() presetColors: string[] = ["#ffffff", "#000000", "#f10d0d", "#6af572", "#224dab"];
  @Input() presetColorNames: string[] = []

  private onChange: any = (color: string[]) => {console.log(color)};
  private onTouch: any = {}

  color: string;
  colorname: string

  ngOnInit(): void {
    
  }

  matchColor(hex: string){
    this.colorname = this.colorService.matchColorName(hex)
    this.onChange([this.colorname, this.color]);
  }
}
