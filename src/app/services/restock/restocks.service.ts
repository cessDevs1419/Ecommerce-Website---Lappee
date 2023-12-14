import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestockProductsList } from 'src/assets/models/restock';
import { GETProductRestock, GETRestockReports, GETRestockReportsView, POSTProductRestock } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class RestocksService {

  constructor(private http: HttpClient) { }



  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
  postRestocks(data: FormData): Observable<any> {
    return this.http.post<any>(POSTProductRestock, data, this.httpOptions);
  } 
  getRestockProducts(): Observable<any>{
    return this.http.get<RestockProductsList>(GETProductRestock);
  }
  getRestockList(): Observable<any>{
    return this.http.get<any>(GETRestockReports);
  }
  getRestockListView(id: string): Observable<any>{
    return this.http.get<any>(GETRestockReportsView+id);
  }
}
