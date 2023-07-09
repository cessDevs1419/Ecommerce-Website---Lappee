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
  private request: number = 0;
  responseObservable: Observable<string>;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getToken(): Observable<CsrfResponse> {
    return this.http.get<CsrfResponse>(GETCsrfToken, { withCredentials:true });
  }

  init(): void {
    this.getToken().subscribe({
      next: (response: any) => {},
      complete: () => {}
    });

    this.csrfToken = this.cookieService.get('XSRF-TOKEN');
  }

  // return private token
  getCsrfToken(): string {
    this.request++;
    //console.log("Request #" + this.request + ": " + this.cookieService.get('XSRF-TOKEN'));
    return this.cookieService.get('XSRF-TOKEN');
  }

}