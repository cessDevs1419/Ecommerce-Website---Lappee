import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  
  isClassToggled: boolean = false;
  toggleContent: boolean = false;
  toggleProduct: boolean = false;
  toggleOrder: boolean = false;
  ContentMenu: boolean = false;
  ProductMenu: boolean = false;
  OrderMenu: boolean = false;
  overviewClass: boolean = false;

  admin_bg: string = "admin-bg-dark";
  sidebar_bg: string = "sidebar-bg-dark";
  active_link: string = "active-link";
  active_link_icon: string = "active-link-icon";
  
  toggleClass() {
    this.isClassToggled = !this.isClassToggled;
    
  }


  
  @Input() headerName: string;
  @Input() admin!: boolean;
  @Input() courier!: boolean;
  
  constructor(private router: Router) {}
  
  
  ngOnInit(): void {

  }
  
  closeContent(){
    this.ContentMenu = false
    this.toggleContent = false
  }
  
  closeFile(){
    this.ProductMenu = false
    this.toggleProduct = false
  }
  
  closeAllMenu(){
    this.ContentMenu = false
    this.toggleContent = false
    this.ProductMenu = false
    this.toggleProduct = false
    this.overviewClass = true
    console.log(this.overviewClass )
  }
  
  
  showContent(){
    this.ContentMenu = true
    this.toggleContent = true
    this.router.navigate(['/admin/site-settings']);
    this.closeFile()
  }
  
  showProduct(){
    this.ProductMenu = true
    this.toggleProduct = true

    this.router.navigate(['/admin/attribute-management']);
    this.closeContent()
  }
  
  showOrders(){
    this.ProductMenu = true
    this.toggleProduct = true

    this.router.navigate(['/admin/order-management']);
    this.closeContent()
  }
  
  isOverviewActive(): boolean {
    return this.router.url === '/admin/overview';
  }
  
  isManageProductActive(): boolean {
    return (
      this.router.url === '/admin/attribute-management' ||
      this.router.url === '/admin/category-management' ||
      this.router.url === '/admin/product-management'
    );
  }
  
  isManageOrderActive(): boolean {
    return (
      this.router.url === '/admin/order-management' ||
      this.router.url === '/admin/order-management'
    );
  }
  
  isManageContentActive(): boolean {
    return (
      this.router.url === '/admin/site-settings' ||
      this.router.url === '/admin/manage-about-us' ||
      this.router.url === '/admin/manage-tos' 
    );
  }
  
  isManageSalesReportActive(): boolean {
    return this.router.url === '/admin/sales-management' 
  }
  
  isManageInquiriesActive(): boolean {
    return this.router.url === '/admin/inquiry' 
  }
  
  isManageAccountsActive(): boolean {
    return this.router.url === '/admin/accounts-management' 
  }
  
  
  isSiteSettingsActive(): boolean {
    return this.router.url === '/admin/site-settings';
  }
  isAboutSiteActive(): boolean {
    return this.router.url === '/admin/manage-about-us';
  }
  isTermsSiteActive(): boolean {
    return this.router.url === '/admin/manage-tos';
  }
}
