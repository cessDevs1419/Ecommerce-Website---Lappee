import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CsrfResponse } from 'src/assets/models/csrf';
import { GETCsrfToken } from '../endpoints';
import { formatCsrfToken } from 'src/app/utilities/response-utils';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {

  private authToken: string;
  responseObservable: Observable<string>;

  constructor(private http: HttpClient) { }

  private getToken(): Observable<CsrfResponse> {
    return this.http.get<CsrfResponse>(GETCsrfToken, { withCredentials:true });
  }

  resolveToken(): void {

    this.getToken().subscribe({
      next: (response: any) => {
        
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })

    /* if(!this.authToken){
      this.responseObservable = this.getToken().pipe(map((response: any) => formatCsrfToken(response)));
      this.responseObservable.subscribe((token: string) => {
        this.authToken = token;
      });
    } */
  }

  getCsrfToken(): string {
    this.resolveToken();
    return this.authToken;
  }

}
