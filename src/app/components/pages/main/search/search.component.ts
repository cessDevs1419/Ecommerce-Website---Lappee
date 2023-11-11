import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { SearchService } from 'src/app/services/search/search.service';
import { formatCategoryProduct, formatProducts } from 'src/app/utilities/response-utils';
import { CategoryProduct, Product } from 'src/assets/models/products';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService, private router:Router) {
    this.navsubscription = this.router.events.subscribe((e: any) => {
      if(e instanceof NavigationEnd){
        this.initResults();
      }
    })
  }

  navsubscription: any;
  term: string;
  results: Observable<CategoryProduct[]>

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => this.term = params['searchTerm']);
    console.log(this.term);
    this.initResults();
  }

  initResults(): void {
    this.results = this.searchService.getSearchResults(this.term).pipe(map((response: any) => formatCategoryProduct(response)));
  }

  ngOnDestroy(): void {
    if(this.navsubscription){
      this.navsubscription.unsubscribe();
    }
  }
}
