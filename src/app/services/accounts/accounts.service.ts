import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Register } from 'src/assets/models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
      //try lang why not
    })
  };

  constructor(private http: HttpClient) { }

  postRegisterUser(data: FormData): Observable<any> {
    return this.http.post<Register>('https://127.0.0.1:8000/api/auth/register', data, this.httpOptions);
  } 


  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
