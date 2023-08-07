import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GETSiteDetails, PATCHEditSiteName, POSTUploadSiteLogo } from '../endpoints';
import { Observable, map, of } from 'rxjs';
import { formatSiteDetails } from 'src/app/utilities/response-utils';
import { SiteDetails } from 'src/assets/models/sitedetails';

@Injectable({
  providedIn: 'root'
})
export class SiteDetailsService {

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  };

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

  uploadSiteLogo(data: FormData): Observable<any>
  {
    return this.http.post<any>(POSTUploadSiteLogo, data);
  }

  editSiteTitle(data: FormData): Observable<any>
  {
    return this.http.patch<any>(PATCHEditSiteName, data);
  }

  ngOnInit(): void {
    this.resolveTitle();
  }
}