import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryList } from 'src/assets/models/categories';
import { Observable, from } from 'rxjs';
import { GETCategories, GETSubcategories } from '../endpoints';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private categoryCache!: Observable<CategoryList>;

  constructor(private http: HttpClient) { }

  public getCategories(): Observable<CategoryList> {
    if(!this.categoryCache){
      //this.categoryCache = this.http.get<CategoryList>(GETSubcategories);
      this.categoryCache = this.http.get<CategoryList>('../../assets/sampleData/categories.json');
    }
    return this.categoryCache;
  }
}
