import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductStatisticsList, SalesStatisticsList } from 'src/assets/models/sales';
import { GETProductStatistics, GETSalesStatistics } from '../endpoints';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalesStatisticsService {

  constructor(private http: HttpClient) { }

  getSalesStatistics(): Observable<any>{
    return this.http.get<SalesStatisticsList>(GETSalesStatistics);
  }

  getProductStatistics(id: string | null): Observable<any>{
    return this.http.get<ProductStatisticsList>(GETProductStatistics + id);
  }

}
