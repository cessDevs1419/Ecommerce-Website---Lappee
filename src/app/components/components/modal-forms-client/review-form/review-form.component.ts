import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray } from '@angular/forms';
import { OrderContent } from 'src/assets/models/order-details';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {
  @Input() product: OrderContent;
  @ViewChild('attachmentUpload') imgInput: ElementRef;
  rating: number;
  files: string[] = [];

  ratingChange(rating: number){
    this.rating = rating;
    console.log(rating + " stars");
  }

  imgUpload(event: any): void{

    let img: File = event.target.files[event.target.files.length - 1];
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.files.push(e.target.result);
    }
    reader.readAsDataURL(img);
  }
}
