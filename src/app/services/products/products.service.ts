import { Injectable } from '@angular/core';
import { Product, ProductList, Variant } from 'src/assets/models/products';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DELETEProductsAdmin, GETMyStylesProducts, GETProductDetails, GETProducts, GETProductsAll, GETProductsBestSeller, GETProductsByCategory, GETProductsSuggestions, GETProductsTrending, PATCHProductsAdmin, POSTMyStylesRecord, POSTProductsAdmin, GETMyStylesSuggest } from '../endpoints';
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

  getProductsAll(): Observable<any>{
    console.log(this.http.get<ProductList>(GETProducts))
    return this.http.get<ProductList>(GETProductsAll);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }
    
  getProductsSuggestion(id: String): Observable<any>{
    // console.log(this.http.get<ProductList>(GETProducts))
    return this.http.get<ProductList>(GETProductsSuggestions + id);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }

  getProductsTrending(): Observable<any>{
    // console.log(this.http.get<ProductList>(GETProducts))
    return this.http.get<ProductList>(GETProductsTrending);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }

  getProductsBestSeller(): Observable<any>{
    // console.log(this.http.get<ProductList>(GETProducts))
    return this.http.get<ProductList>(GETProductsBestSeller);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }
    
    

  getProductDetails(id: string): Observable<any> {
    // console.log(this.http.get(GETProductDetails + id))
    return this.http.get(GETProductDetails + id);
    //return this.http.get<ProductList>('../../assets/sampleData/products.json');
  }

  public getProductByCategory(id: string): Observable<any> {
    console.log(this.http.get(GETProductsByCategory + id))
    return this.http.get(GETProductsByCategory + id, this.httpOptions)
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
  

  // deleteProduct(prodId: number): Observable<any> {
  //   return this.http.delete(DELETEProductsAdmin, {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Credentials': 'true'
  //     }),
  //     responseType: 'json',
  //     body: {
  //         id: prodId
  //       }
  //   })
  // }
  
  deleteProduct(prodIds: number[]): Observable<any> {
    return this.http.request('delete', DELETEProductsAdmin, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: {
        products: prodIds
      }
    });
  }

  getMyStyles(): Observable<any> {
    return this.http.get(GETMyStylesProducts);
  }

  postMyStylesRecord(data: FormData): Observable<any> {
    return this.http.post(POSTMyStylesRecord, data, this.httpOptions)
  }

  getMyStylesSuggestions(id: string): Observable<any> {
    return this.http.get(GETMyStylesSuggest + id, this.httpOptions)
    //return this.http.get('../../assets/sampleData/product_suggestion.json')
  }
}
