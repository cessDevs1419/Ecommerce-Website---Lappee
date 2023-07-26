import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeliveryInfoList } from 'src/assets/models/deliveryinfo';
import { GETDeliveryInfo, POSTDeliveryInfo } from '../endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryinfoService {

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  };

  constructor(private http: HttpClient) { }

  getDeliveryInfo(): Observable<any> {
    return this.http.get<DeliveryInfoList>(GETDeliveryInfo)
  }

  postDeliveryInfo(form: FormData): Observable<any> {
    return this.http.post(POSTDeliveryInfo, form, this.httpOptions);
  }
}
