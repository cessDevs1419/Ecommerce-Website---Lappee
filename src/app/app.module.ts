import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CategorydetailsComponent } from './components/categorydetails/categorydetails.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { EntryComponent } from './components/entry/entry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupformComponent } from './components/signupform/signupform.component';
import { SigninformComponent } from './components/signinform/signinform.component';
import { PasswordValidatorDirective } from '../assets/directives/passwordValidator/password-validator.directive';
import { InputWithToggleComponent } from './components/input-with-toggle/input-with-toggle.component';
import { SubcategoriesComponent } from './components/subcategories/subcategories.component';
import { ProductsComponent } from './components/products/products.component';
import { StarRatingsComponent } from './components/star-ratings/star-ratings.component';

@NgModule({
  declarations: [
    AppComponent,
    CategorydetailsComponent,
    NavbarComponent,
    SearchbarComponent,
    HomeComponent,
    FooterComponent,
    EntryComponent,
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
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'entry', component: EntryComponent},
      {path: 'subcategory/:subcategoryId', component: SubcategoriesComponent},
      {path: 'products/:productId', component: ProductsComponent}
    ]),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: DEFAULT_CURRENCY_CODE,
    useValue: 'PHP'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
