import { AdminCategory, AdminCategoryList, Category, CategoryList, Subcategory } from "src/assets/models/categories";
import { Order, Product, ProductList, Variant } from "src/assets/models/products";
import { Review, ReviewItem, ReviewList } from "src/assets/models/reviews";
import { Observable, map, of } from 'rxjs';
import { CsrfToken } from "src/assets/models/csrf";
import { BannedUser, User } from "src/assets/models/user";
import { SubcategoryList, AdminSubcategory } from "src/assets/models/subcategories";
import { DeliveryInfoList, DeliveryInfo } from "src/assets/models/deliveryinfo";
import { OrderDetail, OrderList, AdminOrder, AdminOrderDetailList, AdminOrderContent, AdminOrderDetail, AdminOrderList } from "src/assets/models/order-details";
import { Inquiry, InquiryContentList, InquiryList } from "src/assets/models/inquiry";
import { formatDate } from "@angular/common";
import { AboutUsTosList, AboutUsTosSection, Banner, BannersList, SiteDetails, SiteDetailsList, SiteLogo, SiteLogoList } from "src/assets/models/sitedetails";

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
    sub_category_id: data.sub_category_id,
    description: data.description,
    images: data.images,
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

  return reviewList.map((review: Review) => ({
    review_id: review.review_id,
    user_id: review.user_id,
    email: review.email,
    rating: review.rating,
    content: review.content,
    reviewed_on: review.reviewed_on,
    images: review.images
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
      created_at: formatDate(data.created_at, 'medium', 'en_PH'),
      last_login: formatDate(data.last_login, 'medium', 'en_PH'),
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

export function formatDeliveryInfo(response: DeliveryInfoList): DeliveryInfo[] {
  return response.data.map((data: DeliveryInfo) => ({
    user_id: data.user_id,
    city: data.city,
    province: data.province,
    zip_code: data.zip_code,
    address: data.address,
    id: data.id,
    number: data.number
  }))
}

export function formatAdminOrder(response: AdminOrderList): AdminOrder[] {
  return response.data.map((data: AdminOrder) => ({
    id: data.id,
    user_id: data.user_id,
    status: data.status,
    created_at: formatDate(data.created_at, 'medium', 'en_PH'),
    updated_at: formatDate(data.updated_at, 'medium', 'en_PH'),
    paid: data.paid,
    tracking_no: formatDate(data.tracking_no, 'medium', 'en_PH'),
    packed_date: formatDate(data.packed_date, 'medium', 'en_PH') ,
    shipped_date: formatDate(data.shipped_date, 'medium', 'en_PH'),
    delivered_date: formatDate(data.delivered_date, 'medium', 'en_PH'),
    total_price: data.total_price,
    address_line_1: data.address_line_1,
    address_line_2: data.address_line_2,
    city: data.city,
    province: data.province,
    zip_code: data.zip_code
  }))
}

export function formatAdminOrderDetail(data: AdminOrderDetailList): AdminOrderDetail {
  return {
      order_id: data.data.order_id,
      user_id: data.data.user_id,
      status: data.data.status,
      created_at: formatDate(data.data.created_at, 'medium', 'en_PH'),
      updated_at: formatDate(data.data.updated_at, 'medium', 'en_PH'),
      paid: data.data.paid,
      tracking_no: data.data.tracking_no,
      packed_date: data.data.packed_date,
      shipped_date: data.data.shipped_date,
      delivered_date: data.data.delivered_date,
      total_price: data.data.total_price,
      address_line_1: data.data.address_line_1,
      address_line_2: data.data.address_line_2,
      city: data.data.city,
      province: data.data.province,
      zip_code: data.data.zip_code,
      order_contents: data.data.order_contents
  };
}

export function formatOrderDetails(response: OrderList): OrderDetail[] {
  return response.data.map((data: OrderDetail) => ({
    order_id: data.order_id,
    ordered_on: formatDate(data.ordered_on, 'medium', 'en_PH'),
    order_contents: data.order_contents
  }))
}

export function formatInquiries(response: InquiryList): Inquiry[] {
  return response.data.map((data: Inquiry) => ({
    id: data.id,
    email: data.email,
    name: data.email,
    message: data.message,
    created_at: formatDate(data.created_at, 'medium', 'en_PH'),
    updated_at: data.updated_at,
    is_read: data.is_read,
  }));
}

export function formatInquiryContent(response: InquiryContentList): Inquiry {
  return {
    id: response.data.id,
    email: response.data.email,
    name: response.data.email,
    message: response.data.message,
    created_at: formatDate(response.data.created_at, 'medium', 'en_PH'),
    updated_at: response.data.updated_at,
    is_read: response.data.is_read,
  };
}

export function formatAboutUsTos(response: AboutUsTosList): AboutUsTosSection[] {
  return response.data.map((data: AboutUsTosSection) => ({
    id: data.id,
    title: data.title,
    content: data.content,
    order: data.order,
    created_at: data.created_at,
    updated_at: data.updated_at
  }))
}

export function formatBanners(response: BannersList): Banner[] {
  return response.data.map((data: Banner) => ({
    id: data.id,
    label: data.label,
    path: data.path
  }))
}

export function formatSiteDetails(response: SiteDetailsList): SiteDetails {
  return {
    site_name: response.data.site_name
  }
}

export function formatSiteLogo(response: SiteLogoList): SiteLogo {
  return {
    site_logo: response.data.site_logo
  }
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

export function filterDeliveryInfo(userID: string, DeliveryInfoObservable: Observable<DeliveryInfo[]>): Observable<DeliveryInfo[]> {
  return DeliveryInfoObservable.pipe(
    map((entry: DeliveryInfo[]) => {
      return entry.filter((deliveryInfo: DeliveryInfo) => deliveryInfo.user_id === userID);
    })
  );
}

export function findDeliveryInfo(userID: string, DeliveryInfoObservable: Observable<DeliveryInfo[]>): Observable<boolean> {
  return DeliveryInfoObservable.pipe(map((deliveryInfos: DeliveryInfo[]) => {
    return deliveryInfos.some((deliveryInfo: DeliveryInfo) => deliveryInfo.user_id === userID);
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
      return prods.sort((a: any, b: any) => a.product_variants[0].price - b.product_variants[0].price);
    }));
  }
  if (mode == "descending"){
    return productObservable.pipe(map((prods: Product[]) => {
      return prods.sort((a: any, b: any) => b.product_variants[0].price - a.product_variants[0].price);
    }));
  }
  
  return productObservable;
}

export function orderSortByDate(orders: Observable<OrderDetail[]>, mode: string): Observable<OrderDetail[]> {
  if (mode == "ascending"){
    return orders.pipe(map((order: OrderDetail[]) => {
      return order.sort((a: any, b: any) => Date.parse(a.ordered_on) - Date.parse(b.ordered_on));
    }));
  }
  if (mode == "descending"){
    return orders.pipe(map((order: OrderDetail[]) => {
      return order.sort((a: any, b: any) => Date.parse(b.ordered_on) - Date.parse(a.ordered_on));
    }));
  }

  return orders;
}