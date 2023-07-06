import { Category, CategoryList, Subcategory } from "src/assets/models/categories";
import { Product, ProductList } from "src/assets/models/products";
import { Review, ReviewList } from "src/assets/models/reviews";
import { Observable, map } from 'rxjs';
import { CsrfToken } from "src/assets/models/csrf";
import { User } from "src/assets/models/user";

// Formatting


// returns a Subcategory array from a SubcategoryList
export function formatSubcategories(response: CategoryList) : Subcategory[] {
    let subcategoriesList = response.data.flatMap((category: Category) => category.sub_categories);
    return subcategoriesList.map((subcategory: Subcategory) => ({
      id: subcategory.id,
      main_category_id: subcategory.main_category_id,
      name: subcategory.name
    }))
    
}

// returns a Category array from a CategoryList
export function formatCategories(response: CategoryList) : Category[] {
    return response.data.map((data: Category) => ({
      id: data.id,
      name: data.name,
      sub_categories: data.sub_categories
    }));
}

// returns a Product array from a ProductList
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

// returns Review array from ReviewList
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

export function formatCsrfToken(response: any): string {
  let response_array = response.data.map((data: CsrfToken) => ({
    csrf_token: data.csrf_token
  }));

  return response_array[0];
}

export function formatUser(response: any): User[] {
  return response.data.map((data: User) => ({
      user_id: data.user_id,
      email: data.email,
      fname: data.fname,
      mname: data.mname,
      lname: data.lname,
      suffix: data.suffix,
      created_at: data.created_at,
      last_login: data.last_login,
      user_type: data.user_type
    }));
}

// Filtering
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