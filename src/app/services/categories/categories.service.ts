import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminCategoryList, CategoryList } from 'src/assets/models/categories';
import { Observable, from } from 'rxjs';
import { GETAdminCategories, GETCategories, GETSubcategories } from '../endpoints';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private categoryCache!: Observable<CategoryList>;
  private adminCategoryCache!: Observable<CategoryList>;

  constructor(private http: HttpClient) { }

  public getCategories(): Observable<CategoryList> {
    if(!this.categoryCache){
      this.categoryCache = this.http.get<CategoryList>(GETCategories);
      //this.categoryCache = this.http.get<CategoryList>('../../assets/sampleData/categories.json');
    }
    return this.categoryCache;
  }

  public getAdminCategories(): Observable<AdminCategoryList> {
    //return this.http.get<CategoryList>(GETAdminCategories);
    return this.http.get<AdminCategoryList>('../../assets/sampleData/categories.json');
  }
}
