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
  private ask: number = 0;
  private status: number = 0;
  responseObservable: Observable<string>;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getToken(): Observable<CsrfResponse> {
    return this.http.get<CsrfResponse>(GETCsrfToken, { withCredentials:true });
  }

  resolveToken(): void {
    
      this.getToken().subscribe({
        next: (response: any) => {
          this.csrfToken = this.cookieService.get('XSRF-TOKEN');
          
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      });

    /* {
      this.responseObservable = this.getToken().pipe(map((response: any) => formatCsrfToken(response)));
      this.responseObservable.subscribe((token: string) => {
        this.authToken = token;
      });
    } */
  }

  getCsrfToken(): string {
    if(!this.csrfToken){
      this.resolveToken();
    }
    return this.csrfToken;
  }

}
