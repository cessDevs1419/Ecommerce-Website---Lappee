import { Injectable } from '@angular/core';
import { ReviewList, Review } from 'src/assets/models/reviews';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
/* import { formatReviews } from 'src/app/utilities/response-utils'; */
import { DELETEReviews, GETReviews, POSTReviews } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //try lang why not
    })
  };

  constructor(private http: HttpClient) { }

  public getReviews(id: string): Observable<any> {
    return this.http.get<ReviewList>(GETReviews + id, this.httpOptions);
  }

  public postReview(data: FormData): Observable<any> {
    return this.http.post(POSTReviews, data, this.httpOptions);
  }

  public deleteReview(data: FormData): Observable<any> {
    return this.http.delete(DELETEReviews, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: data }
  )}
}
