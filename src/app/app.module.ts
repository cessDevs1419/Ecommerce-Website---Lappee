import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { CategorydetailsComponent } from './components/components/categorydetails/categorydetails.component';
import { NavbarComponent } from './components/components/navbar/navbar.component';
import { SearchbarComponent } from './components/components/searchbar/searchbar.component';
import { HomeComponent } from './components/pages/main/home/home.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/components/footer/footer.component';
import { AccountComponent } from './components/pages/main/account/account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupformComponent } from './components/components/signupform/signupform.component';
import { SigninformComponent } from './components/components/signinform/signinform.component';
import { PasswordValidatorDirective } from '../assets/directives/passwordValidator/password-validator.directive';
import { InputWithToggleComponent } from './components/components/input-with-toggle/input-with-toggle.component';
import { SubcategoriesComponent } from './components/pages/main/subcategories/subcategories.component';
import { ProductsComponent } from './components/pages/main/products/products.component';
import { StarRatingsComponent } from './components/components/star-ratings/star-ratings.component';
import { ProgressBarComponent } from './components/components/progress-bar/progress-bar.component';
import { ProductGridComponent } from './components/components/product-grid/product-grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { LayoutModule } from '@angular/cdk/layout';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { CartComponent } from './components/pages/main/cart/cart.component';
import { SearchFilterPipe } from './components/pipes/search-filter.pipe';
import { TableComponent } from './components/components/table/table.component';
import { ModalComponent } from './components/components/modal/modal.component';
import { SidebarComponent } from './components/components/sidebar/sidebar.component';
import { PaginationComponent } from './components/components/pagination/pagination.component';
import { ProfileComponent } from './components/pages/main/profile/profile.component';
import { CartItemComponent } from './components/components/cart-item/cart-item.component';
import { AdminRoutingComponent } from './components/pages/admin/admin-routing/admin-routing.component';
import { AdminOverviewComponent } from './components/pages/admin/admin-overview/admin-overview.component';
import { AdminCategoriesComponent } from './components/pages/admin/admin-categories/admin-categories.component';
import { AdminProductsComponent } from './components/pages/admin/admin-products/admin-products.component';
import { AdminSalesComponent } from './components/pages/admin/admin-sales/admin-sales.component';
import { AdminDiscountsComponent } from './components/pages/admin/admin-discounts/admin-discounts.component';
import { AdminAccountsComponent } from './components/pages/admin/admin-accounts/admin-accounts.component';
import { AdminParcelManagementComponent } from './components/pages/admin/admin-parcel-management/admin-parcel-management.component';
import { AdminOrderManagementComponent } from './components/pages/admin/admin-order-management/admin-order-management.component';
import { AdminCourierManagementComponent } from './components/pages/admin/admin-courier-management/admin-courier-management.component';
import { AdminStocksManagementComponent } from './components/pages/admin/admin-stocks-management/admin-stocks-management.component';
import { CourierRoutingComponent } from './components/pages/courier/courier-routing/courier-routing.component';
import { CourierPendingsComponent } from './components/pages/courier/courier-pendings/courier-pendings.component';
import { CourierDeliveredComponent } from './components/pages/courier/courier-delivered/courier-delivered.component';
import { ProfileBannerComponent } from './components/components/profile-banner/profile-banner.component';
import { OrdersComponent } from './components/pages/main/orders/orders.component';
import { MainRoutingComponent } from './components/pages/main/main-routing/main-routing.component';
import { DonutChartComponent } from './components/components/donut-chart/donut-chart.component';
import { LineGraphComponent } from './components/components/line-graph/line-graph.component';
import { authGuard } from './services/auth/auth-guard.guard';
import { ToastComponent } from './components/components/toast/toast.component';
import { ProductFormComponent } from './components/components/Forms/product-form/product-form.component';
import { CategoryFormComponent } from './components/components/Forms/category-form/category-form.component';
import { AdminParentFormComponent } from './components/components/Forms/admin-parent-form/admin-parent-form.component';
import { DiscountFormComponent } from './components/components/Forms/discount-form/discount-form.component';
import { AccountsFormComponent } from './components/components/Forms/accounts-form/accounts-form.component';
import { AssignParcelsFormComponent } from './components/components/Forms/assign-parcels-form/assign-parcels-form.component';
import { ContactusComponent } from './components/pages/main/contactus/contactus.component';
import { ModalClientComponent } from './components/components/modal-client/modal-client.component';
import { ReviewFormComponent } from './components/components/modal-forms-client/review-form/review-form.component';
import { StarRatingsInputComponent } from './components/components/star-ratings-input/star-ratings-input.component';
import { SearchComponent } from './components/pages/main/search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    CategorydetailsComponent,
    NavbarComponent,
    SearchbarComponent,
    HomeComponent,
    FooterComponent,
    AccountComponent,
    SignupformComponent,
    SigninformComponent,
    PasswordValidatorDirective,
    InputWithToggleComponent,
    SubcategoriesComponent,
    ProductsComponent,
    StarRatingsComponent,
    ProgressBarComponent,
    ProductGridComponent,
    CartComponent,
    SearchFilterPipe,
    TableComponent,
    ModalComponent,
    SidebarComponent,
    PaginationComponent,
    ProfileComponent,
    CartItemComponent,
    AdminRoutingComponent,
    AdminOverviewComponent,
    AdminCategoriesComponent,
    AdminProductsComponent,
    AdminSalesComponent,
    AdminDiscountsComponent,
    AdminAccountsComponent,
    AdminParcelManagementComponent,
    AdminOrderManagementComponent,
    AdminCourierManagementComponent,
    AdminStocksManagementComponent,
    CourierRoutingComponent,
    CourierPendingsComponent,
    CourierDeliveredComponent,
    OrdersComponent,
    ProfileBannerComponent,
    MainRoutingComponent,
    ToastComponent,
    DonutChartComponent,
    LineGraphComponent,
    ProductFormComponent,
    CategoryFormComponent,
    AdminParentFormComponent,
    DiscountFormComponent,
    AccountsFormComponent,
    AssignParcelsFormComponent,
    ContactusComponent,
    ModalClientComponent,
    ReviewFormComponent,
    StarRatingsInputComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
    AppRoutingModule,
    RouterModule.forRoot([
      
      //client
      {path: 'home', component: HomeComponent},
      {path: 'account', component: AccountComponent, canActivate: [authGuard]},
      {path: 'subcategory/:subcategoryId', component: SubcategoriesComponent},
      {path: 'products/:productId', component: ProductsComponent},
      {path: 'cart', component: CartComponent},
      {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
      {path: 'profile/orders', component: OrdersComponent, canActivate: [authGuard]},
      {path: 'contactus', component: ContactusComponent},
      {path: 'search/:searchTerm', component: SearchComponent},

      //admin
      {
        path: 'admin', 
        component: AdminRoutingComponent,
        children: [
          {path: '', redirectTo: 'overview', pathMatch: 'full'},
          {path: 'overview', component: AdminOverviewComponent},
          {path: 'category-management', component: AdminCategoriesComponent,},
          {path: 'product-management', component: AdminProductsComponent},
          {path: 'sales-management', component: AdminSalesComponent},
          {path: 'discounts-management', component: AdminDiscountsComponent},
          {path: 'accounts-management', component: AdminAccountsComponent},
          {path: 'parcel-management', component: AdminParcelManagementComponent},
          {path: 'order-management', component: AdminOrderManagementComponent},
          {path: 'courier-management', component: AdminCourierManagementComponent},
          {path: 'stocks-management', component: AdminStocksManagementComponent},
          {path: 'category-management/:page/:action/:id', component: AdminParentFormComponent},
          {path: 'product-management/:page/:action/:id', component: AdminParentFormComponent},
          {path: 'category-management/:page/:action', component: AdminParentFormComponent},
          {path: 'product-management/:page/:action', component: AdminParentFormComponent},
        ],
        canActivate: [authGuard],
        canActivateChild: [authGuard]
      },

      //courier
      // {path: 'courier', component: CourierRoutingComponent },
      // {path: 'pending-management', component: CourierPendingsComponent, outlet: 'courier'},
      // {path: 'delivery-management', component: CourierDeliveredComponent, outlet: 'courier'},

      {path: '', redirectTo: 'home', pathMatch:'full'}
    ]),

    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    GalleryModule.withConfig({

    }),
    LightboxModule
  ],
  providers: [
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'PHP'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
