import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {AdminCategory, AdminCategoryList, AdminNewCategoryList, CategoryList } from 'src/assets/models/categories';
import { Observable, from } from 'rxjs';
import { GETAdminCategories, GETCategories, GETSubcategories, POSTCategories, PATCHCategories, DELETECategories, GETAttributesAdmin, GETAdminCategoriesAttribute, PATCHVisibilityCategories } from '../endpoints';
import { AttributeList, Attributes } from 'src/assets/models/attributes';


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
      this.categoryCache = this.http.get<CategoryList>(GETCategories, this.httpOptions);
      //this.categoryCache = this.http.get<CategoryList>('../../assets/sampleData/categories.json');
    }
    return this.categoryCache;
  }

  public getAdminCategories(): Observable<AdminCategoryList> {
    return this.http.get<AdminCategoryList>(GETAdminCategories);
  }

  public getNewAdminCategories(): Observable<AdminNewCategoryList> {
    return this.http.get<AdminNewCategoryList>(GETAdminCategories);
  }

  getCategoryAttribute(id: string): Observable<AttributeList>{
    return this.http.get<AttributeList>(GETAdminCategoriesAttribute + id);
  }

  postCategory(data: FormData): Observable<any> {
    return this.http.post<AdminCategory>(POSTCategories, data, this.httpOptions);
  } 
  
  patchCategory(data: FormData): Observable<any> {
    return this.http.patch<AdminCategory>(PATCHCategories, data, this.httpOptions);
  } 

  patchVisibilityCategory(data: FormData): Observable<any> {
    return this.http.patch(PATCHVisibilityCategories, data, this.httpOptions);
  } 
  
  // patchVisibilityCategory(categoryIds: string[]): Observable<any> {
  //   return this.http.patch(PATCHVisibilityCategories, {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Credentials': 'true'
  //     }),
  //     responseType: 'json',
  //     body: {
  //       id: categoryIds 
  //     }
  //   })
  // }
  
  deleteCategories(categoryIds: number[]): Observable<any> {
    return this.http.delete(DELETECategories, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: {
        categories: categoryIds // Pass an array of category IDs
      }
    })
  }
  

  


}
