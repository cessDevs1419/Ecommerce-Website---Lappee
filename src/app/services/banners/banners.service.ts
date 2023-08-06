import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GETBanners } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class BannersService {

  constructor(private http: HttpClient) { }

  getBanners(): Observable<any> {
    return this.http.get(GETBanners);
  }
}
