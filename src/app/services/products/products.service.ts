import { Injectable } from '@angular/core';
import { Product, ProductList } from 'src/assets/models/products';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DELETEProductsAdmin, GETProducts, PATCHProductsAdmin, POSTProductsAdmin } from '../endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
  
  getProducts(){
    return this.http.get<ProductList>(GETProducts);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }
  
  public getAdminProducts(): Observable<ProductList> {
    return this.http.get<ProductList>(GETProducts);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }
  
  postProduct(data: FormData): Observable<any> {
    return this.http.post<Product>(POSTProductsAdmin, data, this.httpOptions);
  } 
  
  patchProduct(data: FormData): Observable<any> {
    return this.http.post<Product>(PATCHProductsAdmin, data, this.httpOptions);
  } 
  
  deleteProduct(data: FormData): Observable<any> {
    return this.http.post<Product>(DELETEProductsAdmin, data, this.httpOptions);
  } 
}
