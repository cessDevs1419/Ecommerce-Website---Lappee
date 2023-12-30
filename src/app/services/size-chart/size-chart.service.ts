import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GETSizeChart } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class SizeChartService {

  constructor(private http: HttpClient) { }

  getSizeCharts(): any {
    return this.http.get(GETSizeChart)
  }
}
