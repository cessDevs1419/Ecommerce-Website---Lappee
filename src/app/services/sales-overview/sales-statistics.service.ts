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
  api = "http://localhost:8000/"

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

  getDatedSalesStatistics(start: string, end: string): Observable<any>{
    return this.http.get<SalesStatisticsList>(this.api + 'api/admin/statistics/overview/from/'+start+'/to/'+end);
  }

  getProductStatistics(id: string | null): Observable<any>{
    return this.http.get<ProductStatisticsList>(GETProductStatistics + id);
  }

  getDatedProductStatistics(id: string | null, start: string, end: string): Observable<any>{
    return this.http.get<ProductStatisticsList>(this.api + 'api/admin/statistics/product/'+ id +'/from/'+ start+'/to/' + end);
  }

  getProductStatisticsYear(id: string | null): Observable<any>{
    return this.http.get<ProductStatisticsList>(this.api + 'api/admin/statistics/product/'+id+'/year');
  }
  
  triggerFunction(data: any) {
    this.triggerFunctionSubject.next(data);
  }
}
