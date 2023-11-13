import { Component, ElementRef, Input, OnInit, ViewChild, EventEmitter, Output, ErrorHandler } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderContent } from 'src/assets/models/order-details';
import { ReviewsService } from 'src/app/services/reviews/reviews.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastComponent } from '../../toast/toast.component';
import { StarRatingsInputComponent } from '../../star-ratings-input/star-ratings-input.component';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {
  @Input() product: OrderContent;
  @Output() activateToast = new EventEmitter<string[]>();
  @Output() dismiss = new EventEmitter();

  @ViewChild(StarRatingsInputComponent) stars: StarRatingsInputComponent;
  @ViewChild('attachmentUpload') imgInput: ElementRef;
  rating: number = 0;
  files: File[] = [];
  images: File[] = [];

  reviewForm = new FormGroup({
    reviewRating: new FormControl(0, Validators.required),
    reviewContent: new FormControl('', Validators.required),
    reviewAnonymous: new FormControl(0)
  });

  get reviewRating() { return this.reviewForm.get('reviewRating') };
  get reviewContent() { return this.reviewForm.get('reviewContent') };
  get reviewAnonymous() { return this.reviewForm.get('reviewAnonymous') };

  constructor(private reviewsService: ReviewsService, private eh: ErrorHandlerService){}

  ratingChange(rating: number){
    this.rating = rating;
    this.reviewRating?.setValue(rating);
    console.log(rating + " stars");
  }

  imgUpload(event: any): void{
    let img: File = event.target.files[event.target.files.length - 1];
    let reader = new FileReader();
    this.files.push(img);
    reader.onload = (e: any) => {
      this.images.push(e.target.result);
    }
    reader.readAsDataURL(img);
  }

  dismissModal(): void {
    this.reviewForm.reset();
    this.files = [];
    this.images = [];
    this.imgInput.nativeElement.value = "";
    this.rating = 0;

    console.log('dismiss from form');
    this.dismiss.emit();
  }

  submitReview(): void {
    console.log(this.reviewForm.valid);
    if(this.reviewForm.valid){
      let formData: any = new FormData();
      formData.append('product_id', this.product.product_id);
      formData.append('rating', this.reviewRating?.value);
      formData.append('content', this.reviewContent?.value);
      formData.append('hide_my_email', this.reviewAnonymous?.value ? 1 : 0);

      if(this.files){
        this.files.forEach((file, index) => {
          formData.append('images[]', file);
          console.log(file);
        });
      }


      console.log(formData);

      this.reviewsService.postReview(formData).subscribe({
        next: (response: any) => {
          console.log('success');
          this.activateToast.emit(['Successfully added!', 'Your review has been added.', 'default']);
          this.reviewForm.reset();
          setTimeout(() => {
            this.dismissModal();
          }, 500)
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.activateToast.emit(['Oops!', this.eh.handle(err), 'negative']);
        }});
      }
    else {
      this.reviewForm.markAllAsTouched();
    }
  }
}
