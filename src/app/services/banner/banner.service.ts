import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InquiryList } from 'src/assets/models/inquiry';
import { GETBanners } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };

  constructor(private http: HttpClient) { }

  getBanner(): Observable<InquiryList>
  {
    return this.http.get<InquiryList>(GETBanners);
  }
}
