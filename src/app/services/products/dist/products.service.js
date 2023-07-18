"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductsService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var endpoints_1 = require("../endpoints");
var ProductsService = /** @class */ (function () {
    function ProductsService(http) {
        this.http = http;
        this.httpOptions = {
            headers: new http_1.HttpHeaders({
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
                //galing kay dell
            })
        };
    }
    ProductsService.prototype.getProducts = function () {
        return this.http.get(endpoints_1.GETProducts);
        //return this.http.get<ProductList>('../../assets/sampleData/products.json');
    };
    ProductsService.prototype.getAdminProducts = function () {
        //return this.http.get<CategoryList>(GETAdminCategories);
        return this.http.get('../../assets/sampleData/products.json');
    };
    ProductsService.prototype.postProduct = function (data) {
        return this.http.post(endpoints_1.POSTProductsAdmin, data, this.httpOptions);
    };
    ProductsService.prototype.patchProduct = function (data) {
        return this.http.post(endpoints_1.PATCHProductsAdmin, data, this.httpOptions);
    };
    ProductsService.prototype.deleteProduct = function (data) {
        return this.http.post(endpoints_1.DELETEProductsAdmin, data, this.httpOptions);
    };
    ProductsService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ProductsService);
    return ProductsService;
}());
exports.ProductsService = ProductsService;
