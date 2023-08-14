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
  
  toggleClass() {
    this.isClassToggled = !this.isClassToggled;
    
  }


  
  @Input() headerName: string;
  @Input() admin!: boolean;
  @Input() courier!: boolean;
  
  constructor(private router: Router) {}
  subMenu: boolean = false;
  
  ngOnInit(): void {

    
  }
  setFalse(){
    this.subMenu = false
    this.toggleContent = false
  }
  
  showSubmenu(){
    this.subMenu = true
    this.toggleContent = true
    this.router.navigate(['/admin/site-settings']);
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
