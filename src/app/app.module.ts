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
import { AdminInquiryComponent } from './components/pages/admin/admin-inquiry/admin-inquiry.component';
import { QuantityInputComponent } from './components/components/quantity-input/quantity-input.component';
import { AboutUsComponent } from './components/pages/main/about-us/about-us.component';
import { TosComponent } from './components/pages/main/tos/tos.component';
import { AdminSiteSettingsComponent } from './components/pages/admin/admin-site-settings/admin-site-settings.component';
import { OrdersFormComponent } from './components/components/Forms/orders-form/orders-form/orders-form.component';
import { AdminManageAboutUsComponent } from './components/pages/admin/admin-manage-about-us/admin-manage-about-us.component';
import { AdminManageTosComponent } from './components/pages/admin/admin-manage-tos/admin-manage-tos.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { OrderHistoryLoaderComponent } from './components/components/loader/main/order-history-loader/order-history-loader.component';
import { LoaderComponent } from './components/components/loader/loader.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AdminAttributesComponent } from './components/pages/admin/admin-attributes/admin-attributes.component';
import { AdminMainCategoriesComponent } from './components/pages/admin/admin-main-categories/admin-main-categories.component';
import { AdminSubCategoriesComponent } from './components/pages/admin/admin-sub-categories/admin-sub-categories.component';
import { AttributeFormComponent } from './components/components/Forms/attribute-form/attribute-form.component';
import { ConfirmDialogComponent } from './components/components/modal-forms-client/confirm-dialog/confirm-dialog.component';
import { EditCartItemComponent } from './components/components/modal-forms-client/edit-cart-item/edit-cart-item.component';
import { VariantAttributesComponent } from './components/components/variant-attributes/variant-attributes.component';
import { CategoryProductsComponent } from './components/pages/main/category-products/category-products.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPickerComponent } from './components/components/color-picker/color-picker.component';
import { NotificationDropdownComponent } from './components/components/notification-dropdown/notification-dropdown.component';
import { VerifyEmailComponent } from './components/pages/main/verify-email/verify-email.component';
import { RichTextEditorComponent } from './components/components/rich-text-editor/rich-text-editor.component';
import { NgxEditorModule } from 'ngx-editor';
import { LoginComponent } from './components/pages/main/login/login.component';
import { RegisterComponent } from './components/pages/main/register/register.component';
import { OutlineCircleSpinnerComponent } from './components/components/loader/general/outline-circle-spinner/outline-circle-spinner/outline-circle-spinner.component';
import { ChatsComponent } from './components/components/chats/chats.component';
import { ToggleswitchComponent } from './components/components/toggleswitch/toggleswitch.component';
import { ToastNotificationComponent } from './components/components/toast-notification/toast-notification.component';
import { ToasterComponent } from './components/components/toaster/toaster/toaster.component';
import { ProductCarouselComponent } from './components/components/product-carousel/product-carousel/product-carousel.component';
import { AdminProductStatisticsComponent } from './components/pages/admin/admin-product-statistics/admin-product-statistics.component';
import { OrderDetailsComponent } from './components/pages/main/order-details/order-details/order-details.component';
import { CountersComponent } from './components/components/counters/counters.component';
import { BarGraphComponent } from './components/components/bar-graph/bar-graph.component';
import { DonutChartComponent } from './components/components/donut-chart/donut-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { AdminOrderPackComponent } from './components/pages/admin/admin-order-pack/admin-order-pack.component';
import { AdminOrderShipComponent } from './components/pages/admin/admin-order-ship/admin-order-ship.component';
import { AdminOrderShippingComponent } from './components/pages/admin/admin-order-shipping/admin-order-shipping.component';
import { AdminOrderDeliveredComponent } from './components/pages/admin/admin-order-delivered/admin-order-delivered.component';
import { AdminOrderCancelComponent } from './components/pages/admin/admin-order-cancel/admin-order-cancel.component';
import { AdminOrderHoldComponent } from './components/pages/admin/admin-order-hold/admin-order-hold.component';
import { CancelOrderComponent } from './components/components/modal-forms-client/cancel-order/cancel-order.component';
import { AdminOrderCancelledComponent } from './components/pages/admin/admin-order-cancelled/admin-order-cancelled.component';
import { SetupReminderComponent } from './components/components/modal-forms-client/setup-reminder/setup-reminder/setup-reminder.component';
import { MyStylesComponent } from './components/pages/main/my-styles/my-styles.component';
import { MyStylesPrimerComponent } from './components/components/modal-forms-client/my-styles-primer/my-styles-primer.component';
import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop'
import { AdminChatComponent } from './components/pages/admin/admin-chat/admin-chat.component';
import { ModalNotificationComponent } from './components/components/modal-notification/modal-notification.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MaintenanceModeComponent } from './components/pages/maintenance-mode/maintenance-mode.component';
import { FloatingChatContainerComponent } from './components/components/floating-chat-container/floating-chat-container.component';
import { OrderChatsComponent } from './components/pages/main/order-chats/order-chats.component';
import { ElResizableDirective } from '../assets/directives/elresizable/el-resizable.directive';
import { AdminHoldDenyReasonsComponent } from './components/pages/admin/admin-hold-deny-reasons/admin-hold-deny-reasons.component';
import { AdminProductGroupComponent } from './components/pages/admin/admin-product-group/admin-product-group.component';
import { ReasonFormComponent } from './components/components/Forms/reason-form/reason-form.component';
import { ProductGroupFormComponent } from './components/components/Forms/product-group-form/product-group-form.component';
import { RestockFormComponent } from './components/components/Forms/restock-form/restock-form.component';
import { AdminShippingFeeComponent } from './components/pages/admin/admin-shipping-fee/admin-shipping-fee.component';
import { ShippingFeeFormComponent } from './components/components/Forms/shipping-fee-form/shipping-fee-form.component';
import { UploadShippingProofComponent } from './components/components/modal-forms-client/upload-shipping-proof/upload-shipping-proof/upload-shipping-proof.component';
import { AdminReturnComponent } from './components/pages/admin/admin-return/admin-return.component';
import { ReturnOrderComponent } from './components/components/modal-forms-client/return-order/return-order/return-order.component';
import { SelectAddressComponent } from './components/components/modal-forms-client/select-address/select-address/select-address.component';
import { AdminAccountsUsersComponent } from './components/pages/admin/admin-accounts-users/admin-accounts-users.component';
import { AdminAccountsCustomersComponent } from './components/pages/admin/admin-accounts-customers/admin-accounts-customers.component';
import { AdminManageSizeComponent } from './components/pages/admin/admin-manage-size/admin-manage-size.component';
import { NotFoundComponent } from './components/pages/main/not-found/not-found.component';
import { VariantsFormComponent } from './components/components/Forms/variants-form/variants-form.component';

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
    SearchComponent,
    AdminInquiryComponent,
    QuantityInputComponent,
    AboutUsComponent,
    TosComponent,
    AdminSiteSettingsComponent,
    OrdersFormComponent,
    AdminManageAboutUsComponent,
    AdminManageTosComponent,
    OrderHistoryLoaderComponent,
    LoaderComponent,
    AdminAttributesComponent,
    AdminMainCategoriesComponent,
    AdminSubCategoriesComponent,
    AttributeFormComponent,
    ConfirmDialogComponent,
    EditCartItemComponent,
    VariantAttributesComponent,
    CategoryProductsComponent,
    ColorPickerComponent,
    NotificationDropdownComponent,
    VerifyEmailComponent,
    RichTextEditorComponent,
    LoginComponent,
    RegisterComponent,
    OutlineCircleSpinnerComponent,
    ChatsComponent,
    ToggleswitchComponent,
    ToastNotificationComponent,
    ToasterComponent,
    ProductCarouselComponent,
    AdminProductStatisticsComponent,
    OrderDetailsComponent,
    CountersComponent,
    BarGraphComponent,
    DonutChartComponent,
    AdminOrderPackComponent,
    AdminOrderShipComponent,
    AdminOrderShippingComponent,
    AdminOrderDeliveredComponent,
    AdminOrderCancelComponent,
    AdminOrderHoldComponent,
    CancelOrderComponent,
    AdminOrderCancelledComponent,
    SetupReminderComponent,
    MyStylesComponent,
    MyStylesPrimerComponent,
    AdminChatComponent,
    ModalNotificationComponent,
    MaintenanceModeComponent,
    FloatingChatContainerComponent,
    OrderChatsComponent,
    ElResizableDirective,
    AdminHoldDenyReasonsComponent,
    AdminProductGroupComponent,
    ReasonFormComponent,
    ProductGroupFormComponent,
    RestockFormComponent,
    AdminShippingFeeComponent,
    ShippingFeeFormComponent,
    UploadShippingProofComponent,
    AdminReturnComponent,
    ReturnOrderComponent,
    SelectAddressComponent,
    AdminAccountsUsersComponent,
    AdminAccountsCustomersComponent,
    AdminManageSizeComponent,
    NotFoundComponent,
    VariantsFormComponent,
  ],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    LayoutModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
    AppRoutingModule,
    NgxEditorModule,
    RouterModule.forRoot([
      
      //client
      
      { path: 'home', component: HomeComponent, title: 'Home' },
      // { path: 'maintenance', component: MaintenanceModeComponent, title: 'Maintenance'},
      // {path: 'account', component: AccountComponent, canActivate: [authGuard], title: 'Account'},
      {path:'login', component: LoginComponent, canActivate: [authGuard], title: 'Log In'},
      {path: 'register', component: RegisterComponent, canActivate: [authGuard], title: 'Register'},
      {path: 'subcategory/:subcategoryId', component: SubcategoriesComponent},
      {path: 'category/:categoryId' , component: CategoryProductsComponent},
      {path: 'products/:productId', component: ProductsComponent},
      {path: 'cart', component: CartComponent, title: 'Cart', canActivate: [authGuard]},
      {path: 'profile', component: ProfileComponent, canActivate: [authGuard], title: 'Profile'},
      {path: 'profile/orders', component: OrdersComponent, canActivate: [authGuard], title: 'Orders'},
      {path: 'profile/orders/details/:orderId', component: OrderDetailsComponent, canActivate: [authGuard], title: 'Order Details'},
      {path: 'profile/orders/details/chats/:id', component: OrderChatsComponent, canActivate: [authGuard], title: 'Order Chats'},
      {path: 'contactus', component: ContactusComponent, title: 'Contact Us'},
      {path: 'search/:searchTerm', component: SearchComponent, title: 'Search'},
      {path: 'about-us', component: AboutUsComponent, title: 'About Us'},
      {path: 'tos', component: TosComponent, title: 'Terms of Service'},
      {path: 'verify-email/:id/:token', component: VerifyEmailComponent, canActivate: [authGuard], title: 'Email Verification'},
      {path: 'my-styles', component: MyStylesComponent, title: 'My Styles'},
      

      //admin
      {
        path: 'admin', 
        component: AdminRoutingComponent,
        children: [
          {path: '', redirectTo: 'overview', pathMatch: 'full' , title: 'Dashboard'},
          {path: 'overview', component: AdminOverviewComponent, title: 'Dashboard'},
          {path: 'attribute-management', component: AdminAttributesComponent, title: 'Product Management'},
          {path: 'category-management', component: AdminCategoriesComponent, title: 'Product Management'},
          {path: 'product-management', component: AdminProductsComponent, title: 'Product Management'},
          {path: 'sales-management', component: AdminSalesComponent, title: 'Sales Management'},
          {path: 'discounts-management', component: AdminDiscountsComponent, title: 'Discounts Management'},
          {path: 'accounts-management-admins', component: AdminAccountsComponent, title: 'Accounts Management'},
          {path: 'accounts-management-users', component: AdminAccountsUsersComponent, title: 'Accounts Management'},
          {path: 'accounts-management-customers', component: AdminAccountsCustomersComponent, title: 'Accounts Management'},
          {path: 'parcel-management', component: AdminParcelManagementComponent},
          {path: 'order-management', component: AdminOrderManagementComponent, title: 'Order Management'},
          {path: 'order-packed', component: AdminOrderPackComponent, title: 'Order Management'},
          {path: 'order-ship', component: AdminOrderShipComponent, title: 'Order Management'},
          {path: 'order-shipping', component: AdminOrderShippingComponent, title: 'Order Management'},
          {path: 'order-delivered', component: AdminOrderDeliveredComponent, title: 'Order Management'},
          {path: 'chats', component: AdminChatComponent, title: 'Chats'},
          {path: 'chats/:id', component: AdminChatComponent, title: 'Chats'},
          //{path: 'order-cancel', component: AdminOrderCancelComponent},
          {path: 'order-return', component: AdminReturnComponent, title: 'Order Management'},
          {path: 'order-cancelled', component: AdminOrderCancelledComponent, title: 'Order Management'},
          {path: 'order-on-hold', component: AdminOrderHoldComponent, title: 'Order Management'},
          {path: 'courier-management', component: AdminCourierManagementComponent},
          {path: 'stocks-management', component: AdminStocksManagementComponent},
          {path: 'category-management/:page/:action/:id', component: AdminParentFormComponent},
          {path: 'product-management/:page/:action/:id', component: AdminParentFormComponent, title: 'Product Management'},
          {path: 'product-management/:page/:action/:var_id/:connector/:prod_id', component: AdminParentFormComponent},
          {path: 'category-management/:page/:action', component: AdminParentFormComponent},
          {path: 'product-management/:page/:action', component: AdminParentFormComponent},
          {path: 'product-statistics/:id', component: AdminProductStatisticsComponent, title: 'Sales Management'},
          {path: 'inquiry', component: AdminInquiryComponent, title: 'Inquiry Management'},
          {path: 'site-settings', component: AdminSiteSettingsComponent, title: 'Content Management'},
          {path: 'site-settings/:action', component: AdminSiteSettingsComponent, title: 'Content Management'},
          {path: 'manage-about-us', component: AdminManageAboutUsComponent, title: 'Content Management'},
          {path: 'manage-tos', component: AdminManageTosComponent, title: 'Content Management'},
          {path: 'manage-size-charts', component: AdminManageSizeComponent, title: 'Content Management'},
          {path: 'manage-hold-deny-reasons', component: AdminHoldDenyReasonsComponent, title: 'Content Management'},
          {path: 'manage-product-group', component: AdminProductGroupComponent, title: 'Content Management'},
          {path: 'manage-shipping-fee', component: AdminShippingFeeComponent, title: 'Shipping Fee'},
        ],
        canActivate: [authGuard],
        canActivateChild: [authGuard]
      },

      //courier
      // {path: 'courier', component: CourierRoutingComponent },
      // {path: 'pending-management', component: CourierPendingsComponent, outlet: 'courier'},
      // {path: 'delivery-management', component: CourierDeliveredComponent, outlet: 'courier'},

      {path: '', redirectTo: 'home', pathMatch:'full'},
      {path: '**', component: NotFoundComponent, title: 'Not Found'},
    ]),
    
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    GalleryModule.withConfig({

    }),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    LightboxModule,
    NgxImageZoomModule,
    ColorPickerModule,
    NgChartsModule,
    DragDropModule,
    CdkDrag
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
