import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GETAttributesAdmin, PostAttributeAdmin } from '../endpoints';
import { AttributeList, Attributes } from 'src/assets/models/attributes';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  constructor(private http: HttpClient) { 

  }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
  
  getAttribute(): Observable<any>{
      return this.http.get<AttributeList>(GETAttributesAdmin);
  }
  
  postAttribute(data: FormData): Observable<any> {
      return this.http.post<Attributes>(PostAttributeAdmin, data, this.httpOptions);
  } 
  
}
