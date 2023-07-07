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
export const POSTCategories: string = api + "/api/admin/category/main/store";
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
export const POSTLogin: string = api + "api/auth/login";
export const POSTRegister: string = api + "api/auth/register";
export const POSTLogout: string = api + "api/auth/logout";
export const GETUser: string = api + "api/auth/user";

//Reviews Endpoints
export const GETReviews: string = api + "api/client/products/reviews/?id=";