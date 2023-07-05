import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CsrfResponse } from 'src/assets/models/csrf';
import { GETCsrfToken } from '../endpoints';
import { formatCsrfToken } from 'src/app/utilities/response-utils';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {

  private csrfToken: string;
  responseObservable: Observable<string>;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getToken(): Observable<CsrfResponse> {
    return this.http.get<CsrfResponse>(GETCsrfToken, { withCredentials:true });
  }

  // probably best kung magclear muna ng cookies bago irun to

  init(): void {
    // hindi nagrerequest pag wala yung .subscribe, 
    this.getToken().subscribe({
      next: (response: any) => {},
      complete: () => {}
    });

    // get cookie set by the api
    this.csrfToken = this.cookieService.get('XSRF-TOKEN');
  }

  // return private token
  getCsrfToken(): string {
    //console.log(this.csrfToken);
    return this.csrfToken;
  }

}