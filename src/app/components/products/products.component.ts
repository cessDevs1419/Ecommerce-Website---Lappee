import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  isFaved: boolean = false;

  // color sample object
  colorCurrent = {
    name: '',
    hex: ''
  }

  colors = [
    { name: 'black', hex: '#000000'},
    { name: 'primary', hex:'#1C92FF'},
    { name: 'gray', hex: '#3C3C3C'}
  ];

  fave() {
    this.isFaved = !this.isFaved;
  }


}
