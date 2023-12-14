import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductGroupList } from 'src/assets/models/product-groups';
import { GETProductGroup, POSTProductGroup } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupService {
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
  
  constructor(private http: HttpClient) { }
  
  getAdminProductGroup(): Observable<any> {
    return this.http.get<ProductGroupList>(GETProductGroup);
  }

  postAdminProductGroup(data: FormData): Observable<any>
  {
    return this.http.post<any>(POSTProductGroup, data, this.httpOptions);
  }
  
}
