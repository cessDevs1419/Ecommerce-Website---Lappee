import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DELETEAboutUs, DELETEToS, GETAboutUs, GETTos, POSTAddABoutUs, POSTAddToS } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class AboutUsTosService {

  constructor(private http: HttpClient) { }

  getAboutUs(): Observable<any> {
    return this.http.get(GETAboutUs)
  }

  getTos(): Observable<any> {
    return this.http.get(GETTos);
  }

  postAddAboutUs(data: FormData): Observable<any>
  {
    return this.http.post<any>(POSTAddABoutUs, data);
  }
  
  postAddToS(data: FormData): Observable<any>
  {
    return this.http.post<any>(POSTAddToS, data);
  }

  deleteAboutUsSection(data: FormData): Observable<any>
  {
    return this.http.delete<any>(DELETEAboutUs, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: data 
    });
  
  }
  deleteToSSection(data: FormData): Observable<any>
  {
    return this.http.delete<any>(DELETEToS, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: data 
    });
  }
}
