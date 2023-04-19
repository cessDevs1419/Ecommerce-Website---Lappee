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
    StarRatingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'account', component: AccountComponent},
      {path: 'subcategory/:subcategoryId', component: SubcategoriesComponent},
      {path: 'products/:productId', component: ProductsComponent}
    ]),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'PHP'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
