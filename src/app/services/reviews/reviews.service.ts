import { Injectable } from '@angular/core';
import { ReviewList, Review } from 'src/assets/models/reviews';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { formatReviews } from 'src/app/utilities/response-utils';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient) { }

  public getReviews(): Observable<Review[]> {
    return this.http.get<ReviewList>('../assets/sampleData/reviews.json').pipe(map((response: any) => formatReviews(response)));
  }
}
