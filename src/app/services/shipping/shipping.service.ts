import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ShippingFee, ShippingFeeList } from 'src/assets/models/shipping';
import { GETAdminShippingFee, GETShippingFee, POSTAdminShippingFee } from '../endpoints';
import { formatShippingFee, formatShippingFeeFlatten } from 'src/app/utilities/response-utils';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  shippingCache: Observable<ShippingFeeList>;

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  };

  constructor(private http: HttpClient) { }

  getAdminShippingFeeList(): Observable<ShippingFeeList> {
    return this.http.get<ShippingFeeList>(GETAdminShippingFee);
  }

  getClientShippingFeeList(): Observable<ShippingFeeList> {
    return this.http.get<ShippingFeeList>(GETShippingFee);
  }

  postShippingFee(data: FormData): Observable<any> {
   // console.log(data)
    return this.http.post(POSTAdminShippingFee, data, this.httpOptions);
  }

  checkProvinceFee(province: string, array: ShippingFee[]): string {
    //check for province
    let generals = array.filter((rule: ShippingFee) => rule.scope == 'general');
    let specifics = array.filter((rule: ShippingFee) => rule.scope == 'specific');
    let match = specifics.find((rule: ShippingFee) => rule.provinces?.includes(province));

    if(match){
      return match.price
    }
    else if(generals.length > 0) {
      return generals[0].price
    }
    else {
      return "0"
    }
  }

}
