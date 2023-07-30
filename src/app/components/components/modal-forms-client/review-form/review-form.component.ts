import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderContent } from 'src/assets/models/order-details';
import { ReviewsService } from 'src/app/services/reviews/reviews.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {
  @Input() product: OrderContent;
  @ViewChild('attachmentUpload') imgInput: ElementRef;
  rating: number = 0;
  files: string[] = [];

  reviewForm = new FormGroup({
    reviewRating: new FormControl(0, Validators.required),
    reviewContent: new FormControl('', Validators.required),
    reviewAnonymous: new FormControl(0)
  });

  get reviewRating() { return this.reviewForm.get('reviewRating') };
  get reviewContent() { return this.reviewForm.get('reviewContent') };
  get reviewAnonymous() { return this.reviewForm.get('reviewAnonymous') };

  constructor(private reviewsService: ReviewsService){}

  ratingChange(rating: number){
    this.rating = rating;
    this.reviewRating?.setValue(rating);
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

  submitReview(): void {
    console.log(this.reviewForm.valid);
    if(this.reviewForm.valid){
      let formData: any = new FormData();
      formData.append('product_id', this.product.product_id);
      formData.append('rating', this.reviewRating?.value);
      formData.append('content', this.reviewContent?.value);
      formData.append('hide_my_email', this.reviewAnonymous?.value ? 0 : 1);

      console.log(formData);

      this.reviewsService.postReview(formData).subscribe({
        next: (response: any) => {
          console.log('success');
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }});
      }
    else {
      this.reviewForm.markAllAsTouched();
    }
  }
}
