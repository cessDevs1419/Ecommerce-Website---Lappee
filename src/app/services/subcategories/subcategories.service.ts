import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubcategoryList, AdminSubcategory } from 'src/assets/models/subcategories';
import { BehaviorSubject, Observable } from 'rxjs';
import { GETSubcategories, POSTSubcategories, PATCHSubcategories, DELETESubcategories } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
  constructor(private http: HttpClient) { 
    //this.Subcategories$ = new BehaviorSubject<SubcategoryList>(this.getSubcategories());
  }

  getAdminSubcategories(): Observable<SubcategoryList> {
    return this.http.get<SubcategoryList>(GETSubcategories);
    //return this.http.get<SubcategoryList>('../../assets/sampleData/subcategories.json')
  }
  
  postCategory(data: FormData): Observable<any> {
    return this.http.post<AdminSubcategory>(POSTSubcategories, data, this.httpOptions);
  } 
  
  patchCategory(data: FormData): Observable<any> {
    return this.http.post<AdminSubcategory>(PATCHSubcategories, data, this.httpOptions);
  } 
  
  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(DELETESubcategories, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: {
          id: categoryId
        }
    })
  }

}
