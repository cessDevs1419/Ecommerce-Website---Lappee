import { AdminCategory, AdminCategoryList, Category, CategoryList, Subcategory } from "src/assets/models/categories";
import { Product, ProductList, Variant } from "src/assets/models/products";
import { Review, ReviewItem, ReviewList } from "src/assets/models/reviews";
import { Observable, map, of } from 'rxjs';
import { CsrfToken } from "src/assets/models/csrf";
import { BannedUser, User } from "src/assets/models/user";
import { SubcategoryList, AdminSubcategory } from "src/assets/models/subcategories";
import { Address, AddressList } from "src/assets/models/address";

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

// returns an AdminSubcategory array from an Admin-side Subcategory List
export function formatAdminSubcategories(response: SubcategoryList): AdminSubcategory[] {
  return response.data.map((data: AdminSubcategory) => ({
    id: data.id,
    main_category: data.main_category,
    name: data.name
  }))
}

// returns an AdminCategory array from an Admin-side Subcategory List
export function formatAdminCategories(response: AdminCategoryList): AdminCategory[] {
  return response.data.map((data: AdminCategory) => ({
    id: data.id,
    name: data.name
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
    description: data.description,
    product_variants: data.product_variants
  }));
}

// returns Variant array from a ProductList
export function formatProductVariants(response: ProductList): Variant[] {
  let variantList = response.data.flatMap((product: Product) => product.product_variants);
  return variantList.map((variant: Variant) => ({
    variant_id: variant.variant_id,
    product_id: variant.product_id,
    color: variant.color,
    color_title: variant.color_title,
    size: variant.size,
    stock: variant.stock,
    stock_limit: variant.stock_limit,
    price: variant.price
  }));
}

// returns Review array from ReviewList
export function formatReviews(response: ReviewList): Observable<ReviewItem> {
  console.log(response);
  let data = response.data;
  let format: ReviewItem = {
    product_id: data.product_id,
    rating: data.rating,
    count: data.count,
    reviews: data.reviews
  }
  return of(format)
}

export function formatReviewsDetails(response: any): Review[] {
  let reviewList = response.data.reviews;
  console.log(reviewList);
  return reviewList.map((review: Review) => ({
    id: review.id,
    email: review.email,
    rating: review.rating,
    content: review.content,
    reviewed_on: review.reviewed_on
  }))
  
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

export function formatBannedUser(response: any): BannedUser[] {
  return response.data.map((data: BannedUser) => ({
      id: data.id,
      user_id: data.user_id,
      reason: data.reason
    }));
}

export function formatAddress(response: AddressList): Address[] {
  return response.data.map((data: Address) => ({
    user_id: data.user_id,
    city: data.city,
    province: data.province,
    zip_code: data.zip_code,
    address_line_1: data.address_line_1,
    address_line_2: data.address_line_2,
    id: data.id
  }))
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

export function filterAddresses(userID: string, addressObservable: Observable<Address[]>): Observable<Address | null> {
  return addressObservable.pipe(map((entry: Address[]) => {
    return entry.find((address: Address) => address.user_id === userID) || null;
  }));
}

export function findAddresses(userID: string, addressObservable: Observable<Address[]>): Observable<boolean> {
  return addressObservable.pipe(map((addresses: Address[]) => {
    return addresses.some((address: Address) => address.user_id === userID);
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