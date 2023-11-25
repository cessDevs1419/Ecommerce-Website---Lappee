import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {
  
  constructor (private router: Router) {}

  @Output() dismissOffcanvas: EventEmitter<any> = new EventEmitter<any>();

  searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl('')
  });

  get searchTerm() { return this.searchForm.get('searchTerm') }

  search(): void {
    let term = this.searchTerm?.value ? this.searchTerm.value : '';
    this.router.navigate(['/search', term])
    this.dismissOffcanvas.emit();
  }
}
