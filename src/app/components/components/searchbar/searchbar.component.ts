import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {
  
  constructor (private router: Router) {}

  searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl('')
  });

  get searchTerm() { return this.searchForm.get('searchTerm') }

  search(): void {
    let term = this.searchTerm?.value ? this.searchTerm.value : 'a';
    this.router.navigate(['/search', term])
  }
}
