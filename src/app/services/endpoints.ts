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
export const GETAdminCategories: string = api + "api/admin/category";
export const GETAdminCategoriesAttribute: string = api + "api/admin/category/attributes/";
export const POSTCategories: string = api + "api/admin/category/store";
export const PATCHCategories: string = api + "api/admin/category/edit";
export const DELETECategories: string = api + "api/admin/category/delete";

// Product Client Endpoints
export const GETProducts: string = api + "api/client/products";
export const GETProductDetails: string = api + "api/client/products/details/"
export const GETProductsByCategory: string = api + "api/client/products/category/"
export const GETProductsAll: string = api + "api/client/products/all"
export const GETProductsSuggestions: string = api + "api/client/products/suggest/"
export const GETProductsTrending: string = api + "api/client/products/trending"
export const GETMyStylesProducts: string = api + "api/client/products/my-styles"
export const POSTMyStylesRecord: string = api + "api/client/my-style/record"

//Product Admin Endpoints
export const GETProductsAdmin: string = api + "api/admin/products";
export const POSTProductsAdmin: string = api + "api/admin/products/store";
export const PATCHProductsAdmin: string = api + "api/admin/products/edit";
export const DELETEProductsAdmin: string = api + "api/admin/products/delete";

//Attributes Admin Endpoints
export const GETAttributesAdmin: string = api + "api/admin/attributes";
export const GETSelectedAttributesAdmin: string = api + "api/admin/attributes/main/{id}";
export const PostAttributeAdmin: string = api + "api/admin/attributes/store";
export const DeleteMultiAttributeAdmin: string = api + "api/admin/attributes/delete";
export const DeleteAttributeAdmin: string = api + "api/admin/attributes/delete/";

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

//Email Endpoints
export const GETVerifyEmail: string = api + "api/client/verify-email"

//Order Endpoints
//Admin
export const GETOrder: string = api + "api/admin/orders";
export const GETAdminOrderPending: string = api + "api/admin/orders/list/pending";
export const GETAdminOrderToPack: string = api + "api/admin/orders/list/to-pack";
export const GETAdminOrderToShip: string = api + "api/admin/orders/list/to-ship";
export const GETAdminOrderShipping: string = api + "api/admin/orders/list/shipping";
export const GETAdminOrderDelivered: string = api + "api/admin/orders/list/delivered";
export const GETAdminOrderCancel: string = api + "api/admin/orders/cancellation-requests/index";
export const GETAdminOrderCancelled: string = api + "api/admin/orders/list/cancelled";
export const GETAdminOrderHold: string = api + "api/admin/orders/list/hold";
export const GETAdminOrderDetail: string = api + "api/admin/orders/details?order_id=";
export const PATCHPackStatus: string = api + "api/admin/orders/mark/to-pack"
export const PATCHToShipStatus: string = api + "api/admin/orders/mark/to-ship"
export const PATCHShipStatus: string = api + "api/admin/orders/mark/shipping"
export const PATCHDeliverStatus: string = api + "api/admin/orders/mark/deliver"
export const PATCHHold: string = api + "api/admin/orders/mark/hold"
export const PATCHCancel: string = api + "api/admin/orders/cancellation-requests/approve"
export const PATCHDeny: string = api + "api/admin/orders/cancellation-requests/deny"


//Client
export const GETOrderDetail: string = api + "api/client/orders/details?order_id=";
export const GETOrderDetailByUser: string = api + "api/client/orders/user";
export const POSTOrder: string = api + "api/client/orders/store";

//Order Cancellations
export const POSTCancelOrder: string = api + "api/client/orders/cancel"

//Notifications 
export const GETNotifications: string = api + "api/admin/notif";
export const PATCHNotifications: string = api + "api/admin/notif/mark";
export const PATCHMarkAllReadNotifications: string = api + "api/admin/notif/markAll";

//Inquiry Endpoints
export const GETInquiry: string = api + "api/admin/inquiry";
export const GETInquiryById: string = api + "api/admin/inquiry/view/";
export const POSTReplyInquiry: string = api + "api/admin/inquiry/reply";
export const POSTInquiry: string = api + "api/client/inquiry/store";

//Discounts Endpoint
export const GETDiscountProducList: string = api + "api/admin/products/discounts/product-list";
export const POSTDiscount: string = api + "api/admin/products/discounts/store";

//Dashboard Endpoint
export const GETDashboard: string = api + "api/admin/dashboard";


//Sales Overview Endpoint
export const GETProductStatistics: string = api + "api/admin/statistics/product/";
export const GETSalesStatistics: string = api + "api/admin/statistics/overview";
export const GETSalesStatisticsMonth: string = api + "api/admin/statistics/month/overview ";
export const GETSalesStatisticsYear: string = api + "api/admin/statistics/year/overview";
export const GETSalesStatisticsReport: string = api + "api/admin/statistics/overview/report";
export const GETSalesStatisticsYearReport: string = api + "api/admin/statistics/year/report";
export const GETSalesStatisticsDatedReport: string = api + "api/admin/statistics/overview/from/";

//Product Group
export const POSTProductGroup: string = api + "api/admin/site-settings/product-groups/save";
export const GETProductGroup: string = api + "api/admin/site-settings/product-groups";

//Chats Endpoint
export const POSTSendConvo: string = api + "api/client/chat/message/send";
export const DELETEConvo: string = api + "api/client/chat/message/delete";
export const GETConversation: string = api + "api/client/chat/message/list/";
export const GETConversationList: string = api + "api/admin/conversations"

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
export const GETAdminShippingFee: string = api + "api/admin/site-settings/shipping-fee";
export const POSTAdminShippingFee: string = api + "api/admin/site-settings/shipping-fee/store";
export const GETShippingFee: string = api + "api/client/orders/shipping-fee"


// Cart
export const GETCartItems: string = api + "api/client/cart";
export const POSTCartItems: string = api + "api/client/cart/store";
export const DELETECartItems: string = api + "api/client/cart/delete";