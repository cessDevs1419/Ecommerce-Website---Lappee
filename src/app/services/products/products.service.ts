import { Injectable } from '@angular/core';
import { ProductList } from 'src/assets/models/products';
import { HttpClient } from '@angular/common/http';
import { GETProducts } from '../endpoints';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts(){
    return this.http.get<ProductList>(GETProducts);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }
}
