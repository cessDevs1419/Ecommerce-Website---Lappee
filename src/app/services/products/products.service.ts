import { Injectable } from '@angular/core';
import { Product, ProductList, Variant } from 'src/assets/models/products';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DELETEProductsAdmin, GETProducts, PATCHProductsAdmin, POSTProductsAdmin } from '../endpoints';
import { BehaviorSubject, Observable, map, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private newData: Observable<Product[]>;
  private productsSubject: BehaviorSubject<Observable<any>> = new BehaviorSubject<Observable<any>>(of([]));
  constructor(private http: HttpClient) {
    this.productsSubject.next(this.newData);
  }
  
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
  
  getNewProducts(): Observable<any> {
    return this.productsSubject.asObservable().pipe(shareReplay(1));
  }

  setProducts(prod: Observable<any>): void {
    this.newData = prod;
    this.productsSubject.next(this.newData);
  }

  public getAdminProducts(): Observable<ProductList> {
    return this.http.get<ProductList>(GETProducts);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }
  
  postProduct(data: FormData): Observable<any> {
    return this.http.post<Product>(POSTProductsAdmin, data, this.httpOptions);
  } 

  
  patchProduct(data: FormData): Observable<any> {
    return this.http.patch<Product>(PATCHProductsAdmin, data, this.httpOptions);
  } 
  

  deleteProduct(prodId: number): Observable<any> {
    return this.http.delete(DELETEProductsAdmin, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: {
          id: prodId
        }
    })
  }
  
  removeDefaultVariantsOnEdit(value: string): void {
    if (!this.newData) {
      this.newData = of([]);
    }

    this.newData = this.newData.pipe(
      map(products => {
        return products.map((product: Product) => ({
          ...product,
          product_variants: product.product_variants.filter((variant: Variant) => value !== variant.variant_id)
        }));
      })
    );
    this.productsSubject.next(this.newData);
  }
}
