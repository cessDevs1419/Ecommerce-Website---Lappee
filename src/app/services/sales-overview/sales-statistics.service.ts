import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProductStatisticsList, SalesModel, SalesStatisticsList } from 'src/assets/models/sales';
import { GETProductStatistics, GETSalesStatistics, GETSalesStatisticsDatedReport, GETSalesStatisticsMonth, GETSalesStatisticsReport, GETSalesStatisticsYear, GETSalesStatisticsYearReport } from '../endpoints';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class SalesStatisticsService {
  private triggerFunctionSubject = new Subject<any>();
  private link = new Subject<any>();
  triggerFunction$ = this.triggerFunctionSubject.asObservable();
  triggerLink$ = this.link.asObservable();
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

  getSalesStatisticsReport(): Observable<any>{
    return this.http.get<SalesStatisticsList>(GETSalesStatisticsReport);
  }
  getSalesStatisticsYearReport(): Observable<any>{
    return this.http.get<SalesStatisticsList>(GETSalesStatisticsYearReport);
  }
  getSalesStatisticsDatedReport(start: string, end: string): Observable<any>{
    return this.http.get<SalesStatisticsList>(GETSalesStatisticsDatedReport+start+'/to/'+end+'/report');
  }

  getDatedSalesStatistics(start: string, end: string): Observable<any>{
    return this.http.get<SalesStatisticsList>(GETSalesStatistics + '/from/'+start+'/to/'+end);
  }

  getProductStatistics(id: string | null): Observable<any>{
    return this.http.get<ProductStatisticsList>(GETProductStatistics + id);
  }

  getDatedProductStatistics(id: string | null, start: string, end: string): Observable<any>{
    return this.http.get<ProductStatisticsList>(GETProductStatistics + id +'/from/'+ start+'/to/' + end);
  }

  getProductStatisticsYear(id: string | null): Observable<any>{
    return this.http.get<ProductStatisticsList>(GETProductStatistics +id+'/year');
  }
  
  triggerFunction(data: any) {
    this.triggerFunctionSubject.next(data);
  }

  triggerLink(link: string) {
    this.link.next(link);
  }
}
