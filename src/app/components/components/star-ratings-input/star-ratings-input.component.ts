import { Component, EventEmitter, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-ratings-input',
  templateUrl: './star-ratings-input.component.html',
  styleUrls: ['./star-ratings-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingsInputComponent),
      multi: true,
    }
  ]
})
export class StarRatingsInputComponent implements ControlValueAccessor {
  private onChange: any = () => {};
  private onTouch: any = () => {};

  writeValue(obj: any): void {
    this.highlightedStar = obj;
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
  @Output() ratingChanged = new EventEmitter<number>();

  stars: number[] = [1, 2, 3, 4, 5];
  highlightedStar: number | null = null;

  isStarHighlighted(index: number): boolean {
    return this.highlightedStar !== null && index <= this.highlightedStar;
  }

  highlightStar(index: number): void {
    this.highlightedStar = index;
  }

  rate(rating: number): void {
    this.ratingChanged.emit(rating);
    this.onChange(rating);
    this.onTouch();
  }
}
