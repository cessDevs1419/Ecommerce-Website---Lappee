import { AdminCategory, AdminCategoryList, Category, CategoryList, NewAdminCategory, NewAdminCategoryList, Subcategory } from "src/assets/models/categories";
import { AdminProduct, AdminProductList, CategoryProduct, MyStyleProduct, Order, Product, ProductList, Variant } from "src/assets/models/products";
import { Review, ReviewItem, ReviewList } from "src/assets/models/reviews";
import { Observable, map, of } from 'rxjs';
import { CsrfToken } from "src/assets/models/csrf";
import { BannedUser, User } from "src/assets/models/user";
import { SubcategoryList, AdminSubcategory } from "src/assets/models/subcategories";
import { DeliveryInfoList, DeliveryInfo } from "src/assets/models/deliveryinfo";
import { OrderDetail, OrderList, AdminOrder, AdminOrderDetailList, AdminOrderContent, AdminOrderDetail, AdminOrderList, AdminOrderCancelRequest, AdminOrderListCancelRequest, AdminCancelledOrderList, AdminCancelledOrder } from "src/assets/models/order-details";
import { Inquiry, InquiryContent, InquiryContentList, InquiryList } from "src/assets/models/inquiry";
import { formatDate } from "@angular/common";
import { AboutUsTosList, AboutUsTosSection, Banner, BannersList, SiteDetails, SiteDetailsList, SiteLogo, SiteLogoList } from "src/assets/models/sitedetails";
import { AttributeList, Attributes } from "src/assets/models/attributes";
import { AdminNotificationList, AdminNotification } from "src/assets/models/admin-notifications";
import { parse } from 'date-fns';
import { Chats, ChatsChannel, ChatsChannelList, ChatsList } from "src/assets/models/chats";
import { DiscountProductList, DiscountProducts } from "src/assets/models/discounts";
import { ProductStatistics, ProductStatisticsList, SalesStatistics, SalesStatisticsList } from "src/assets/models/sales";
import { ShippingFee, ShippingFeeCategory, ShippingFeeList } from "src/assets/models/shipping";

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

// returns an AdminCategory Attribute array from an Admin-side Subcategory List
export function formatAdminCategoriesAttribute(response: NewAdminCategoryList): NewAdminCategory {
  return {
    category_id: response.data.category_id,
    name: response.data.name,
    attributes: response.data.attributes
  }
}


// returns a Category array from a CategoryList
export function formatCategories(response: CategoryList) : Category[] {
    return response.data.map((data: Category) => ({
      id: data.id,
      name: data.name,
      sub_categories: data.sub_categories,
      images: data.images
    }));
}



// returns a Product array from a ProductList
export function formatProducts(response: ProductList): Product[] {
  return response.data.map((data: Product) => ({
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category,
    variants: data.variants,
  }));
}

export function formatAdminProducts(response: AdminProductList): AdminProduct[] {
  return response.data.map((data: AdminProduct) => ({
    product_id: data.product_id,
    name: data.name,
    price: data.price,
    preview_image: data.preview_image
  }));
}

export function formatChats(response: ChatsList): Chats[] {
  return response.data.messages.map((data: Chats) => ({
    id: data.id,
    conversation_id: data.conversation_id,
    sender: data.sender,
    message: data.message,
    attachment: data.attachment,
    created_at: data.created_at,
    updated_at: data.updated_at,
    is_deleted: data.is_deleted
  }));
}



export function formatChatsList(response: ChatsChannelList): ChatsChannel[] {
  return response.data.map((data: ChatsChannel) => ({
    id: data.id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    type: data.type,
    title: data.title
  }));
}

// returns a Product object
export function formatProductObj(response: any): Product {
  let data = response.data
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category,
    variants: data.variants,
  };
}

export function formatProductAll(response: any): Product[] {
  console.log(response);
  return response.data.map((data: Product) => ({
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category,
    variants: data.variants,
  }));
}

export function formatProductSuggestion(response: any): CategoryProduct[] {
    console.log(response);
    return response.data.map((data: CategoryProduct) => ({
        product_id: data.product_id,
        name: data.name,
        price: data.price,
        preview_image: data.preview_image
      }))
  }

export function formatCategoryProduct(response: any): CategoryProduct[] {
  return response.data.map((data: CategoryProduct) => ({
    product_id: data.product_id,
    name: data.name,
    price: data.price,
    preview_image: data.preview_image
  }))
}

export function formatMyStyles(response: any): MyStyleProduct {
  let data: MyStyleProduct = {
    tops: response.data.tops,
    bottoms: response.data.bottoms
  }

  return data;
}

// returns Attributes array from a ProductList
export function formatAttributes(response: AttributeList): Attributes[] {
  return response.data.map((data: Attributes) => ({
    id: data.id,
    name: data.name,
  }));
}

// returns a Notifications Object

export function formatNotificationsResponse(response: AdminNotificationList): AdminNotification[] {
  const sortedData = response.data.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); 
  });
  
  return sortedData.map((data: AdminNotification) => ({
    id: data.id,
    type: data.type,
    content: data.content,
    user_id: data.user_id,
    is_read: data.is_read,
    read_on: formatDate(data.read_on, 'medium', 'en_PH'),
    created_at: formatDate(data.created_at, 'medium', 'en_PH'),
    updated_at: formatDate(data.updated_at, 'medium', 'en_PH'),
  }));
}

// returns Variant array from a ProductListparseFormattedDate
/* export function formatProductVariants(response: ProductList): Variant[] {
  let variantList = response.data.flatMap((product: Product) => product.variants);
  return variantList.map((variant: Variant) => ({
    variant_id: variant.variant_id,
    variant_name: variant.variant_name,
    product_id: variant.product_id,
    color: variant.color,
    color_title: variant.color_title,
    size: variant.size,
    stock: variant.stock,
    stock_limit: variant.stock_limit,
    price: variant.price,
    attributes: variant.attributes,
    variant_images: variant.variant_images
  }));
} */

export function formatProductVariants(response: ProductList): Variant[] {
  let variantList = response.data.flatMap((product: Product) => product.variants);
  return variantList.map((variant: Variant) => ({
    variant_id: variant.variant_id,
    variant_name: variant.variant_name,
    stock: variant.stock,
    price: variant.price,
    attributes: variant.attributes,
    product_id: variant.product_id,
    images: variant.images
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

export function formatProductDiscountList(response: DiscountProductList): DiscountProducts[] {
  return response.data.map((data: DiscountProducts) => ({
      id: data.id,
      name: data.name,
      category_id: data.category_id
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


export function formatSalesStatistics(response: SalesStatisticsList): SalesStatistics {
  return {
    date_range: response.data.date_range,
    sales: response.data.sales,
    order_count: response.data.order_count
  }

}

export function formatProductStatistics(response: ProductStatisticsList): ProductStatistics {
  return {
    date_range: response.data.date_range,
    product_details: response.data.product_details,
    rating: response.data.rating,
    product_sold: response.data.product_sold,
    orders: response.data.orders,
  }

}

export function formatAdminOrder(response: AdminOrderList): AdminOrder[] {
  return response.data.map((data: AdminOrder) => ({
    id: data.id,
    user_id: data.user_id,
    conversation_id: data.conversation_id,
    status: data.status,
    created_at: data.created_at,
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
    zip_code: data.zip_code,
    confirmed_on: data.confirmed_on,
    cancellable: data.cancellable,
    cancellation_reason: data.cancellation_reason,
    cancelled_on: data.cancelled_on,
    contact_number: data.contact_number,
    hold_reason: data.hold_reason,
    hold_date: data.hold_date,
    status_name: data.status_name,

  }))
}

export function formatAdminCancelledOrder(response: AdminCancelledOrderList): AdminCancelledOrder[] {
  return response.data.map((data: AdminCancelledOrder) => ({
    id: data.id,
    user_id: data.user_id,
    conversation_id: '',
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
    zip_code: data.zip_code,
    confirmed_on: data.confirmed_on,
    cancellable: data.cancellable,
    cancellation_reason: data.cancellation_reason,
    cancelled_on: data.cancelled_on,
    contact_number: data.contact_number,
    hold_reason: data.hold_reason,
    hold_date: data.hold_date,
    status_name: data.status_name,
  }))
}

export function formatAdminOrderCancelRequest(response: AdminOrderListCancelRequest): AdminOrderCancelRequest[] {
  return response.data.map((data: AdminOrderCancelRequest) => ({
    id: data.id,
    order_id: data.order_id,
    reason: data.reason,
    created_at: formatDate(data.created_at, 'medium', 'en_PH'),
    updated_at: formatDate(data.updated_at, 'medium', 'en_PH'),
    status: data.status,
    status_name: data.status_name,
  }))
}

export function formatAdminOrderDetail(data: AdminOrderDetailList): AdminOrderDetail {
  return {
      order_id: data.data.order_id,
      user_id: data.data.user_id,
      status: data.data.status,
      ordered_on: formatDate(data.data.ordered_on, 'medium', 'en_PH'),
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
      order_contents: data.data.order_contents,
      payment_proofs: data.data.payment_proofs
  };
}

export function formatOrderDetails(response: OrderList): OrderDetail[] {
  console.log(response);
  return response.data.details.map((data: OrderDetail) => ({
    order_id: data.order_id,
    ordered_on: data.ordered_on,
    conversation_id: data.conversation_id,
    order_contents: data.order_contents,
    status: data.status,
    status_name: data.status_name,
    confirmed_on: data.confirmed_on,
    packed_date: data.packed_date,
    shipped_date: data.shipped_date,
    delivered_date: data.delivered_date,
    cancellable: data.cancellable,
    address: data.address,
    city: data.city,
    province: data.province,
    zip_code: data.zip_code,
    contact_number: data.contact_number,
    payment_proofs: data.payment_proofs
  }))
}

export function formatInquiries(response: InquiryList): Inquiry[] {
  return response.data.map((data: Inquiry) => ({
    id: data.id,
    email: data.email,
    name: data.name,
    message: data.message,
    created_at: formatDate(data.created_at, 'medium', 'en_PH'),
    updated_at: data.updated_at,
    is_read: data.is_read,
  }));
}

export function formatInquiryContent(response: InquiryContentList): InquiryContent {
  // return {
  //   id: response.data.id,
  //   email: response.data.email,
  //   name: response.data.name,
  //   message: response.data.message,
  //   created_at: formatDate(response.data.created_at, 'medium', 'en_PH'),
  //   updated_at: response.data.updated_at,
  //   is_read: response.data.is_read,
  // };

  return {
    inquiry: response.data.inquiry,
    replies: response.data.replies
  }

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

export function formatProductsAndAttributes(response: ProductList): Product[] {
  return response.data.map((data: Product) => ({
    id: data.id,
    name: data.name,
    description: data.description,
    variants: data.variants,
    category: data.category,
  }))
}

export function formatShippingFee(response: ShippingFeeList): ShippingFeeCategory {
  // return response.data.map((data: ShippingFee) => ({
  //   id: data.id,
  //   scope: data.scope,
  //   provinces: data.provinces,
  //   price: data.price
  // }))

  return ({
    general: response.data.general,
    specific: response.data.specific
  })
}

export function formatShippingFeeFlatten(response: ShippingFeeList): ShippingFee[] {
  // return response.data.map((data: ShippingFee) => ({
  //   id: data.id,
  //   scope: data.scope,
  //   provinces: data.provinces,
  //   price: data.price
  // }))

  return response.data.general.concat(response.data.specific)
}

// Filtering
export function filterSubcategories(subcategoryID: string,input: Observable<Subcategory[]>): Observable<Subcategory[]> {
  return input.pipe(map((subs: Subcategory[]) => {
    return subs.filter((subcat: Subcategory) => subcat.id === subcategoryID);
  }));
}

// returns all products with specified subcategory ID
/* export function filterProductsBySubcategory(subcategoryID: string, productObservable: Observable<Product[]> ): Observable<Product[]> {
  return productObservable.pipe(map((prods: Product[]) => {
    return prods.filter((product: Product) => product.sub_category_id === subcategoryID);
  }));
} */

// return all products with specified category
export function filterProductsBySubcategory(category: string, productObservable: Observable<Product[]> ): Observable<Product[]> {
  return productObservable.pipe(map((prods: Product[]) => {
    return prods.filter((product: Product) => product.category === category);
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

export function productSortByName(productObservable: Observable<CategoryProduct[]>, mode: string): Observable<CategoryProduct[]> {
  if (mode == "normal"){
    return productObservable.pipe(map((prods: CategoryProduct[]) => {
      return prods.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }));
  }
  if (mode == "inverse"){
    return productObservable.pipe(map((prods: CategoryProduct[]) => {
      return prods.sort((a: any, b: any) => b.name.localeCompare(a.name));
    }));
  }
  
  return productObservable;
}

export function productSortByPrice(productObservable: Observable<CategoryProduct[]>, mode: string): Observable<CategoryProduct[]> {
  if (mode == "ascending"){
    return productObservable.pipe(map((prods: CategoryProduct[]) => {
      return prods.sort((a: any, b: any) => a.price - b.price);
    }));
  }
  if (mode == "descending"){
    return productObservable.pipe(map((prods: CategoryProduct[]) => {
      return prods.sort((a: any, b: any) => b.price - a.price);
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

export function parseFormattedDate(formattedDate: string): Date {
  const parsedDate = parse(formattedDate, 'yyyy-MM-dd HH:mm:ss', new Date());
  return parsedDate;
}