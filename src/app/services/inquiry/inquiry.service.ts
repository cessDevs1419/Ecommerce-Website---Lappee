import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GETInquiry, GETInquiryById, POSTInquiry } from '../endpoints';
import { Inquiry, InquiryContentList, InquiryList } from 'src/assets/models/inquiry';

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

  getInquiry(): Observable<InquiryList>
  {
    return this.http.get<InquiryList>(GETInquiry);
  }

  getInquiryById(inquiryId: string): Observable<InquiryContentList>
  {
    return this.http.get<InquiryContentList>(GETInquiryById + inquiryId);
  }
}

