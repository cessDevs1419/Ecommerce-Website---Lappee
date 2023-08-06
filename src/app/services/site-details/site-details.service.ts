import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GETSiteDetails } from '../endpoints';
import { Observable, map, of } from 'rxjs';
import { formatSiteDetails } from 'src/app/utilities/response-utils';
import { SiteDetails } from 'src/assets/models/sitedetails';

@Injectable({
  providedIn: 'root'
})
export class SiteDetailsService {

  constructor(private http: HttpClient) { }

  public siteTitle: Observable<string>;
  private siteDetailsCache: Observable<any>;

  getSiteDetails(): Observable<any> {
    if(!this.siteDetailsCache){
      this.siteDetailsCache = this.http.get(GETSiteDetails);
    }
    return this.siteDetailsCache;
  }

  getTitle(): Observable<string> {
    if(this.siteTitle){
      console.log(this.siteTitle);
      return this.siteTitle
    }
    else {
      console.log('no name yet')
      this.resolveTitle();
      return this.siteTitle
    }
  }

  resolveTitle(): Observable<string> {
    let data = this.getSiteDetails().pipe(map((response: any) => formatSiteDetails(response)));
    return data.pipe(
      map((response: SiteDetails) => { this.siteTitle = of(response.site_name.site_name); return response.site_name.site_name })
    )
  }

  ngOnInit(): void {
    this.resolveTitle();
  }
}
