import { Injectable } from '@angular/core';
import { ReviewList, Review } from 'src/assets/models/reviews';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
/* import { formatReviews } from 'src/app/utilities/response-utils'; */
import { GETReviews } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient) { }

  public getReviews(id: string): Observable<any> {
    return this.http.get<ReviewList>(GETReviews + id);
  }
}
