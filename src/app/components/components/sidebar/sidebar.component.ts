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
  toggleFile: boolean = false;
  ContentMenu: boolean = false;
  FileMenu: boolean = false;
  overviewClass: boolean = false;
  
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
    this.FileMenu = false
    this.toggleFile = false
  }
  
  closeAllMenu(){
    this.ContentMenu = false
    this.toggleContent = false
    this.FileMenu = false
    this.toggleFile = false
    this.overviewClass = true
    console.log(this.overviewClass )
  }
  
  
  showContent(){
    this.ContentMenu = true
    this.toggleContent = true
    this.overviewClass = false
    this.router.navigate(['/admin/site-settings']);
    this.closeFile()
  }
  
  showFile(){
    this.FileMenu = true
    this.toggleFile = true
    this.overviewClass = false
    this.router.navigate(['/admin/attribute-management']);
    this.closeContent()
  }
  
  isOverviewActive(): boolean {
    return this.router.url === '/admin/overview';
  }
  
  isManageFileActive(): boolean {
    return (
      this.router.url === '/admin/attribute-management' ||
      this.router.url === '/admin/main-category-management' ||
      this.router.url === '/admin/sub-category-management' ||
      this.router.url === '/admin/product-management' ||
      this.router.url === '/admin/sales-management' ||
      this.router.url === '/admin/order-management' ||
      this.router.url === '/admin/inquiry' ||
      this.router.url === '/admin/accounts-management' 
    );
  }
  
  isManageContentActive(): boolean {
    return (
      this.router.url === '/admin/site-settings' ||
      this.router.url === '/admin/manage-about-us' ||
      this.router.url === '/admin/manage-tos' 
    );
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
