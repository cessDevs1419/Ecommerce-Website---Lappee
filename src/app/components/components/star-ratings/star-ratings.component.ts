import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-ratings',
  templateUrl: './star-ratings.component.html',
  styleUrls: ['./star-ratings.component.css']
})
export class StarRatingsComponent {
  @Input() rating!: number;

  fill(position: number): string {
    // fill star
    if (position <= this.rating){
      return 'bi-star-fill';
    }

    // catches decimals
    if ((position > this.rating) && (position <= Math.ceil(this.rating))){
      return 'bi-star-half';
    } 

    // leave unfilled by default
    return 'bi-star';
  }
}
