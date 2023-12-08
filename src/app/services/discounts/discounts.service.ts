import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GETDiscountProducList, POSTDiscount} from '../endpoints';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiscountProductList } from 'src/assets/models/discounts';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };


  postDiscount(data: FormData): Observable<any> {
      return this.http.post<any>(POSTDiscount, data, this.httpOptions);
  } 

  getProductDiscountList(): Observable<any>{
    return this.http.get<DiscountProductList>(GETDiscountProducList);
  }
}
