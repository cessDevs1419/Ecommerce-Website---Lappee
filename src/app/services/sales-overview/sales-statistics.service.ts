import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProductStatisticsList, SalesModel, SalesStatisticsList } from 'src/assets/models/sales';
import { GETProductStatistics, GETSalesStatistics, GETSalesStatisticsMonth, GETSalesStatisticsYear } from '../endpoints';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class SalesStatisticsService {
  private triggerFunctionSubject = new Subject<any>();
  triggerFunction$ = this.triggerFunctionSubject.asObservable();
  headerFormat: SalesModel
  
  constructor(private http: HttpClient) { }

  getSalesStatistics(): Observable<any>{
    return this.http.get<SalesStatisticsList>(GETSalesStatistics);
  }
  getSalesStatisticsMonthly(): Observable<any>{
    return this.http.get<SalesStatisticsList>(GETSalesStatisticsMonth);
  }
  getSalesStatisticsYearly(): Observable<any>{
    return this.http.get<SalesStatisticsList>(GETSalesStatisticsYear);
  }

  getProductStatistics(id: string | null): Observable<any>{
    return this.http.get<ProductStatisticsList>(GETProductStatistics + id);
  }
  

  triggerFunction(data: any) {
    this.triggerFunctionSubject.next(data);
  }
}
