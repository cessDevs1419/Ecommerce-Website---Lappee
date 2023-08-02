// API URL
const api = "http://localhost:8000/"

//CSRF Endpoint
export const GETCsrfToken: string = api + "sanctum/csrf-cookie";

// Subcategory Endpoints
export const GETSubcategories: string = api + "api/admin/category/sub/";
export const POSTSubcategories: string = api + "api/admin/category/sub/store";
export const PATCHSubcategories: string = api + "api/admin/category/sub/edit";
export const DELETESubcategories: string = api + "api/admin/category/sub/delete";

//Category Endpoints
export const GETCategories: string = api + "api/client/category/";
export const GETAdminCategories: string = api + "api/admin/category/main";
export const POSTCategories: string = api + "api/admin/category/main/store";
export const PATCHCategories: string = api + "api/admin/category/main/edit";
export const DELETECategories: string = api + "api/admin/category/main/delete";

// Product Client Endpoints
export const GETProducts: string = api + "api/client/products";

//Product Admin Endpoints
export const GETProductsAdmin: string = api + "api/admin/products";
export const POSTProductsAdmin: string = api + "api/admin/products/store";
export const PATCHProductsAdmin: string = api + "api/admin/products/edit";
export const DELETEProductsAdmin: string = api + "api/admin/products/delete";

//Account Endpoints
export const POSTLogin: string = api + "auth/login";
export const POSTRegister: string = api + "auth/register";
export const POSTLogout: string = api + "auth/logout";
export const GETUser: string = api + "api/client/user-info";

//User Endpoints
export const GETUsers: string = api + "api/admin/account/users";
export const GETBanUsers: string = api + "api/admin/account/bans";
export const POSTBanUsers: string = api + "api/admin/account/bans/ban";
export const DELETEBanUsers: string = api + "api/admin/account/bans/unban";

//Reviews Endpoints
export const GETReviews: string = api + "api/client/products/reviews/";
export const POSTReviews: string = api + "api/client/products/reviews/store";
export const DELETEReviews: string = api + "api/client/products/reviews/delete"

//Delivery Info Endpoitns
export const GETDeliveryInfo: string = api + "api/client/user-info/delivery-info";
export const POSTDeliveryInfo: string = api + "api/client/user-info/delivery-info/store";
export const PATCHDeliveryInfo: string = api + "api/client/user-info/delivery-info/edit";

//Order Endpoints
export const GETOrderDetail: string = api + "api/client/orders/details?order_id=";
export const GETOrderDetailByUser: string = api + "api/client/orders/user";
export const POSTOrder: string = api + "api/client/orders/store";

//Inquiry Endpoints
export const GETInquiry: string = api + "api/admin/inquiry";
export const GETInquiryById: string = api + "api/admin/inquiry/view/";
export const POSTInquiry: string = api + "api/client/inquiry/store";

// Search Endpoints
export const GETSearchResults: string = api + "api/client/products/search/";