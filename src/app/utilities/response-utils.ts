import { Subcategory, SubcategoryList } from "src/assets/models/subcategories";
import { Category, CategoryList } from "src/assets/models/categories";
import { Product, ProductList } from "src/assets/models/products";
import { Review, ReviewList } from "src/assets/models/reviews";
import { Observable, map } from 'rxjs';

// Formatting
// returns a Subcategory array from a SubcategoryList
export function formatSubcategories(response: SubcategoryList) : Subcategory[] {
    return response.data.map((data: Subcategory) => ({
      id: data.id,
      main_category: data.main_category,
      name: data.name
    }));
}

// returns a Category array from a CategoryList
export function formatCategories(response: CategoryList) : Category[] {
    return response.data.map((data: Category) => ({
      id: data.id,
      name: data.name
    }));
}

// returns a Product array from a CategoryList
export function formatProducts(response: ProductList): Product[] {
  return response.data.map((data: Product) => ({
    id: data.id,
    name: data.name,
    stock: data.stock,
    stock_limit: data.stock_limit,
    sub_category_id: data.sub_category_id,
    price: data.price,
    description: data.description
  }));
}

export function formatReviews(response: any): Review[] {
  return response.data.map((data:Review) => ({
    id: data.id,
    productId: data.productId,
    name: data.name,
    rating: data.rating,
    date: data.date,
    comment: data.comment,
    attachments: data.attachments,
    isUsernameHidden: data.isUsernameHidden
  }));
}

export function filterSubcategories(subcategoryID: string,input: Observable<Subcategory[]>): Observable<Subcategory[]> {
  return input.pipe(map((subs: Subcategory[]) => {
    return subs.filter((subcat: Subcategory) => subcat.id === subcategoryID);
  }));
}

// returns all products with specified subcategory ID
export function filterProductsBySubcategory(subcategoryID: string, productObservable: Observable<Product[]> ): Observable<Product[]> {
  return productObservable.pipe(map((prods: Product[]) => {
    return prods.filter((product: Product) => product.sub_category_id === subcategoryID);
  }));
}

export function filterProductsById(productID: string, productObservable: Observable<Product[]> ): Observable<Product[]> {
  return productObservable.pipe(map((prods: Product[]) => {
    return prods.filter((product: Product) => product.id === productID);
  }));
}

/* Sorting Functions */

export function productSortByName(productObservable: Observable<Product[]>, mode: string): Observable<Product[]> {
  if (mode == "normal"){
    return productObservable.pipe(map((prods: Product[]) => {
      return prods.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }));
  }
  if (mode == "inverse"){
    return productObservable.pipe(map((prods: Product[]) => {
      return prods.sort((a: any, b: any) => b.name.localeCompare(a.name));
    }));
  }
  
  return productObservable;
}

export function productSortByPrice(productObservable: Observable<Product[]>, mode: string): Observable<Product[]> {
  if (mode == "ascending"){
    return productObservable.pipe(map((prods: Product[]) => {
      return prods.sort((a: any, b: any) => a.price - b.price);
    }));
  }
  if (mode == "descending"){
    return productObservable.pipe(map((prods: Product[]) => {
      return prods.sort((a: any, b: any) => b.price - a.price);
    }));
  }
  
  return productObservable;
}