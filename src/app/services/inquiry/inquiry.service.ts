import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { POSTInquiry } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };

  constructor(private http: HttpClient) { }

  postInquiry(data: FormData): Observable<any> {
    return this.http.post(POSTInquiry, data, this.httpOptions);
  }
}

