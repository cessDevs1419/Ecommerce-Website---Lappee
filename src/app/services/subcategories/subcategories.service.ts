import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubcategoryList } from 'src/assets/models/subcategories';
import { BehaviorSubject, Observable } from 'rxjs';
import { GETSubategories } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {

  constructor(private http: HttpClient) { 
    //this.Subcategories$ = new BehaviorSubject<SubcategoryList>(this.getSubcategories());
  }

  getSubcategories(): Observable<SubcategoryList> {
    return this.http.get<SubcategoryList>('./assets/sampleData/subcategories.json');
    //return this.http.get<SubcategoryList>(GETSubategories);
  }
}
