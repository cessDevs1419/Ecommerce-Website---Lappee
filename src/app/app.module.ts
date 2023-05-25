import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { CategorydetailsComponent } from './components/components/categorydetails/categorydetails.component';
import { NavbarComponent } from './components/components/navbar/navbar.component';
import { SearchbarComponent } from './components/components/searchbar/searchbar.component';
import { HomeComponent } from './components/pages/home/home.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/components/footer/footer.component';
import { AccountComponent } from './components/pages/account/account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupformComponent } from './components/components/signupform/signupform.component';
import { SigninformComponent } from './components/components/signinform/signinform.component';
import { PasswordValidatorDirective } from '../assets/directives/passwordValidator/password-validator.directive';
import { InputWithToggleComponent } from './components/components/input-with-toggle/input-with-toggle.component';
import { SubcategoriesComponent } from './components/pages/subcategories/subcategories.component';
import { ProductsComponent } from './components/pages/products/products.component';
import { StarRatingsComponent } from './components/components/star-ratings/star-ratings.component';
import { ProgressBarComponent } from './components/components/progress-bar/progress-bar.component';
import { ProductGridComponent } from './components/components/product-grid/product-grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { LayoutModule } from '@angular/cdk/layout'
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { CartComponent } from './components/pages/cart/cart.component';
import { SearchFilterPipe } from './components/pipes/search-filter.pipe';
import { TableComponent } from './components/components/table/table.component';
import { ModalComponent } from './components/components/modal/modal.component';
import { SidebarComponent } from './components/components/sidebar/sidebar.component';
import { AdminProductsComponent } from './components/pages/admin/admin-products/admin-products.component';
import { AdminOverviewComponent } from './components/pages/admin/admin-overview/admin-overview.component';
import { AdminRoutingComponent } from './components/pages/admin/admin-routing/admin-routing.component';
import { PaginationComponent } from './components/components/pagination/pagination.component';

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
    AdminOverviewComponent,
    AdminProductsComponent,
    AdminRoutingComponent,
    PaginationComponent,
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
      {path: '', component: HomeComponent},
      {path: 'account', component: AccountComponent},
      {path: 'subcategory/:subcategoryId', component: SubcategoriesComponent},
      {path: 'products/:productId', component: ProductsComponent},
      {path: 'cart', component: CartComponent},
      
      //admin
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'product-management', component: AdminProductsComponent},
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
