import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AdminCategory, AdminCategoryList, CategoryList } from 'src/assets/models/categories';
import { Observable, from } from 'rxjs';
import { GETAdminCategories, GETCategories, GETSubcategories, POSTCategories, PATCHCategories, DELETECategories } from '../endpoints';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private categoryCache!: Observable<CategoryList>;
  private adminCategoryCache!: Observable<CategoryList>;
  
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
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
  
  postCategory(data: FormData): Observable<any> {
    return this.http.post<AdminCategory>(POSTCategories, data, this.httpOptions);
  } 
  
  patchCategory(data: FormData): Observable<any> {
    return this.http.post<AdminCategory>(PATCHCategories, data, this.httpOptions);
  } 
  
  deleteCategory(data: FormData): Observable<any> {
    return this.http.post<AdminCategory>(DELETECategories, data, this.httpOptions);
  } 
}
