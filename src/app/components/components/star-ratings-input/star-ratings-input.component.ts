import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-star-ratings-input',
  templateUrl: './star-ratings-input.component.html',
  styleUrls: ['./star-ratings-input.component.css']
})
export class StarRatingsInputComponent {
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
  }
}
