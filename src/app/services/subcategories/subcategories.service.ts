import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { SubcategoryList } from 'src/assets/models/subcategories';
import { BehaviorSubject, Observable } from 'rxjs';
import { GETSubcategories } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {

  /* THIS SERVICE IS NOW UNUSED */
  // keeping this just in case, but Subcategory data is now merged with Category data
  // this also means that the models for SubcategoryList and Subcategory are now unused as well
  constructor(private http: HttpClient) { 
    //this.Subcategories$ = new BehaviorSubject<SubcategoryList>(this.getSubcategories());
  }

 /*  getSubcategories(): Observable<SubcategoryList> {
    return this.http.get<SubcategoryList>(GETSubcategories);
    //return this.http.get<SubcategoryList>(GETSubategories);
  } */
}
