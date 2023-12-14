import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GETDashboard } from '../endpoints';
import { Observable } from 'rxjs';
import { DashboardList } from 'src/assets/models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  constructor(private http: HttpClient) { }

  getDashboard(): Observable<any>{
    return this.http.get<DashboardList>(GETDashboard);
  }

}
