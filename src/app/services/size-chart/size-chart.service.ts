import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DELETEAdminSizeChart, GETAdminSizeChart, GETSizeChart, POSTAdminSizeChart } from '../endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SizeChartService {

  constructor(private http: HttpClient) { }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };

  getSizeCharts(): any {
    return this.http.get(GETSizeChart)
  }

  getAdminSizeCharts(): any {
    return this.http.get(GETAdminSizeChart)
  }

  postAdminSizeCharts(data: FormData): Observable<any> {
    return this.http.post(POSTAdminSizeChart, data, this.httpOptions);
  }

  deleteAdminSizeCharts(size: FormData): Observable<any>
  {
    return this.http.delete<any>(DELETEAdminSizeChart, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: size
    });
  
  }
}
