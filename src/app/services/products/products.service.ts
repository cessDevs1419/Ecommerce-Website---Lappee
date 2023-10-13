import { Injectable } from '@angular/core';
import { Product, ProductList, Variant } from 'src/assets/models/products';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DELETEProductsAdmin, GETProductDetails, GETProducts, GETProductsByCategory, PATCHProductsAdmin, POSTProductsAdmin } from '../endpoints';
import { BehaviorSubject, Observable, map, of, shareReplay } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

	private imageList: FormArray = this.formBuilder.array([]);
	
  private newData: Observable<Product[]>;
  private productsSubject: BehaviorSubject<Observable<any>> = new BehaviorSubject<Observable<any>>(of([]));
  constructor(private http: HttpClient,
    private formBuilder: FormBuilder,
  
  ) {
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
  


	getImageList(): FormArray {
    return this.imageList;
  }
  
  addImageToList(fileControl: FormControl): void {
    this.imageList.push(fileControl);
}
  removeImg(index: number){
    this.imageList.removeAt(index)
  }
  
  removeAllImg(){
    this.imageList.clear()
  }
  
  getProducts(): Observable<any>{
    console.log(this.http.get<ProductList>(GETProducts))
    return this.http.get<ProductList>(GETProducts);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }

  getProductDetails(id: string): Observable<any> {
    console.log(this.http.get(GETProductDetails + id))
    return this.http.get(GETProductDetails + id);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }

  public getProductByCategory(id: string): Observable<any> {
    console.log(this.http.get(GETProductsByCategory + id))
    return this.http.get(GETProductsByCategory + id)
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
  

}
