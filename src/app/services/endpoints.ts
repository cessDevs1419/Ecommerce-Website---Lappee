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
export const GETProductDetails: string = api + "api/client/products/details/"

//Product Admin Endpoints
export const GETProductsAdmin: string = api + "api/admin/products";
export const POSTProductsAdmin: string = api + "api/admin/products/store";
export const PATCHProductsAdmin: string = api + "api/admin/products/edit";
export const DELETEProductsAdmin: string = api + "api/admin/products/delete";

//Attributes Admin Endpoints
export const GETAttributesAdmin: string = api + "api/admin/attributes";
export const GETSelectedAttributesAdmin: string = api + "api/admin/attributes/main/{id}";
export const PostAttributeAdmin: string = api + "api/admin/attributes/store";

//Variant Admin Endpoints
export const POSTVariantsAdmin: string = api + "api/admin/products/variants/store";
export const PATCHVariantsAdmin: string = api + "api/admin/products/variants/edit";
export const DELETEVariantsAdmin: string = api + "api/admin/products/variants/delete";

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
//Admin
export const GETOrder: string = api + "api/admin/products/orders";
export const GETAdminOrderDetail: string = api + "api/admin/products/orders/details?order_id=";
export const PATCHPackStatus: string = api + "api/admin/products/orders/pack"
export const PATCHShipStatus: string = api + "api/admin/products/orders/ship"
export const PATCHDeliverStatus: string = api + "api/admin/products/orders/deliver"

//Client
export const GETOrderDetail: string = api + "api/client/orders/details?order_id=";
export const GETOrderDetailByUser: string = api + "api/client/orders/user";
export const POSTOrder: string = api + "api/client/orders/store";

//Inquiry Endpoints
export const GETInquiry: string = api + "api/admin/inquiry";
export const GETInquiryById: string = api + "api/admin/inquiry/view/";
export const POSTInquiry: string = api + "api/client/inquiry/store";

// Search Endpoints
export const GETSearchResults: string = api + "api/client/products/search/";

// Site Details Endpoints
export const GETTos: string = api + "api/client/content-management/sections/tos";
export const GETAboutUs: string = api + "api/client/content-management/sections/about-us";
export const GETSiteDetails: string = api + "api/client/content-management/view-details";
export const GETBanners: string = api + "api/client/content-management/banners";
export const GETSiteLogo: string = api + "api/client/content-management/site-logo";
export const POSTUploadSiteLogo: string = api + "api/admin/site-settings/site-logo/upload";
export const PATCHEditSiteName: string = api + "api/admin/site-settings/site-name/edit";
export const POSTUploadBanner: string = api + "api/admin/site-settings/banners/store";
export const DELETEBanner: string = api + "api/admin/site-settings/banners/delete";
export const POSTAddABoutUs: string = api + "api/admin/site-settings/about-us/store";
export const POSTAddToS: string = api + "api/admin/site-settings/tos/store";
export const DELETEAboutUs: string = api + "api/admin/site-settings/about-us/delete";
export const DELETEToS: string = api + "api/admin/site-settings/tos/delete";