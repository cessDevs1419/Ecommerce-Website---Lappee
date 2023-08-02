import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GETSearchResults } from '../endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  getSearchResults(term: string): Observable<any> {
    return this.http.get(GETSearchResults + term);
  }
}
