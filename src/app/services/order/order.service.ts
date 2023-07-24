import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GETOrderDetail, POSTOrder } from '../endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
  
  constructor(private http: HttpClient) { }

  getOrderDetail(): Observable<any> {
    return this.http.get(GETOrderDetail);
  }

  postOrder(data: FormData): Observable<any> {
    return this.http.post(POSTOrder, data, this.httpOptions);
  }
}
