import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryList } from 'src/assets/models/categories';
import { Observable } from 'rxjs';
import { GETCategories, GETSubcategories } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  public getCategories(): Observable<CategoryList> {
    return this.http.get<CategoryList>(GETSubcategories);
  }
}
