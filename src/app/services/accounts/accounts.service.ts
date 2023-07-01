import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Register, Login } from 'src/assets/models/account';
import { POSTRegister, POSTLogin } from '../endpoints';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private isLoggedIn: boolean = false; 
  name: string = "Wendell";


  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
      //try lang why not
    })
  };

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit(): void {
    console.log("test");
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  setIsLoggedIn(value: boolean): void {
    this.isLoggedIn = value;
  }

  postRegisterUser(data: FormData): Observable<any> {
    return this.http.post<Register>(POSTRegister, data, this.httpOptions);
  } 

  postLoginUser(data: FormData): Observable<any> {
    return this.http.post<Login>(POSTLogin, data, this.httpOptions);
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

  mockLogin(email: String): void {
    if(this.cookieService.check("login")){
      let cookieName = this.cookieService.get("login");
      if(cookieName[1] != email){
        this.cookieService.delete("login");
      }

      else {
        this.isLoggedIn = true;
        return;
      }
    }

    else {
      this.cookieService.set("login", email.toString(), 1);
      console.log('created cookies')
    }
    this.isLoggedIn = true;
  }

  checkLogin(): void{
    if(this.cookieService.check("login")){
      this.isLoggedIn = true;
    }
  }
}
