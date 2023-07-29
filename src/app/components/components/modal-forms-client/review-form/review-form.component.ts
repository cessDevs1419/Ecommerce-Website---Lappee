import { Component, Input, OnInit } from '@angular/core';
import { OrderContent } from 'src/assets/models/order-details';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {
  @Input() product: OrderContent;
  rating: number;
  

  ratingChange(rating: number){
    this.rating = rating;
    console.log(rating + " stars");
  }
}
