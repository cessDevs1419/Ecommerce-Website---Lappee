import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isClassToggled: boolean = false;

  toggleClass() {
    this.isClassToggled = !this.isClassToggled;
  }
  
  @Input() headerName: string;
  @Input() admin!: boolean;
  @Input() courier!: boolean;
  
  constructor(private router: Router) {}

  
  ngOnInit(): void {
  
    if (this.admin) {
      this.router.navigate(['overview']);
    } else if (this.courier) {
      this.router.navigate([{ outlets: { courier: ['pending-management'] } }]);
    }  
    
  }
  
}
