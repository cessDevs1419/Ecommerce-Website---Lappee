import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryList } from '../../../assets/models/categories';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  public getCategories(): Observable<CategoryList> {
    return this.http.get<CategoryList>('../assets/sampleData/categories.json');
  }
}
