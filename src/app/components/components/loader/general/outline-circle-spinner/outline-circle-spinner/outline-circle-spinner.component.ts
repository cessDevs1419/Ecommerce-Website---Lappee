import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-outline-circle-spinner',
  templateUrl: './outline-circle-spinner.component.html',
  styleUrls: ['./outline-circle-spinner.component.css']
})
export class OutlineCircleSpinnerComponent {
  @Input() isBlue: boolean = false;
  @Input() size: string = "small";

  sizeClass: string = 'size-small';

  ngOnInit(): void {
    switch(this.size){
      case 'small':
        this.sizeClass = 'size-small';
        break;
      case 'medium':
        this.sizeClass = 'size-medium';
        break;
      case 'large':
        this.sizeClass = 'size-large';
        break;
    }
  }
}
