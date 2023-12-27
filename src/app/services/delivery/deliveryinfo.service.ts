import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeliveryInfoList } from 'src/assets/models/deliveryinfo';
import { GETDeliveryInfo, POSTDeliveryInfo, PATCHDeliveryInfo, GETAddressList, POSTAddAddress, PATCHEditAddress, PATCHUseAddress, DELETEAddress, POSTAddName } from '../endpoints';
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

  patchDeliveryInfo(form: FormData): Observable<any> {
    return this.http.patch(PATCHDeliveryInfo, form, this.httpOptions);
  }

  // Address Book + Name
  
  postAddName(data: FormData): Observable<any> {
    return this.http.post(POSTAddName, data, this.httpOptions)
  }

  getAddressList(): Observable<any> {
    return this.http.get(GETAddressList)
  }

  postAddAddress(data: FormData): Observable<any> {
    return this.http.post(POSTAddAddress, data, this.httpOptions)
  }

  patchEditAddress(data: FormData): Observable<any> {
    return this.http.patch(PATCHEditAddress, data, this.httpOptions)
  }

  patchUseAddress(data: FormData): Observable<any> {
    return this.http.patch(PATCHUseAddress, data, this.httpOptions)
  }

  deleteAddress(data: FormData): Observable<any> {
    return this.http.delete(DELETEAddress, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: data }
  )}
}