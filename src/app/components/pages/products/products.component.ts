import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  sizeCurrent = '';

  productToCart: FormGroup = this.fb.group({
    color: ['', Validators.required],
    size: ['', Validators.required]
  });

  colors = [
    { name: 'black', hex: '#000000'},
    { name: 'primary', hex:'#1C92FF'},
    { name: 'gray', hex: '#3C3C3C'}
  ];

  sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

  constructor(private fb: FormBuilder) {}

  fave() {
    this.isFaved = !this.isFaved;
  }

  changeColor(color: string): void {
    this.colorCurrent.name = color;
  }

  changeSize(size: string): void {
    this.sizeCurrent = size;
  }

}
