import { HttpClient } from '@angular/common/http';
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

  getToken(): Observable<CsrfResponse> {
    return this.http.get<CsrfResponse>(GETCsrfToken);
  }

  resolveToken(): void {
    if(!this.authToken){
      this.responseObservable = this.getToken().pipe(map((response: any) => formatCsrfToken(response)));
      this.responseObservable.subscribe((token: string) => {
        this.authToken = token;
      });
    }
  }

  getCsrfToken(): string {
    this.resolveToken();
    return this.authToken;
  }

}
