import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingFeeList } from 'src/assets/models/shipping';
import { GETAdminShippingFee, POSTAdminShippingFee } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  };

  constructor(private http: HttpClient) { }

  lowSFProvinces: string[] = [
    "cavite"
  ]

  getShippingFee(province: string): string {
    return this.lowSFProvinces.includes(province.toLowerCase()) ? "100.00" : "180.00"
  }

  getAdminShippingFeeList(): Observable<ShippingFeeList> {
    return this.http.get<ShippingFeeList>(GETAdminShippingFee);
  }

  postShippingFee(data: FormData): Observable<any> {
    console.log(data)
    return this.http.post(POSTAdminShippingFee, data, this.httpOptions);
  }
}
