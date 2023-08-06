import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GETAboutUs, GETTos } from '../endpoints';

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
}
