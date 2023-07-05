import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Register, Login } from 'src/assets/models/account';
import { POSTRegister, POSTLogin, GETUser } from '../endpoints';
import { CookieService } from 'ngx-cookie-service';
import { User, UserList } from 'src/assets/models/user';
import { formatUser } from 'src/app/utilities/response-utils';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private isLoggedIn: boolean = false; 
  
  user: User = {
    user_id: '',
    email: '',
    fname: '',
    mname: '',
    lname: '',
    suffix: '',
    created_at: ''
  }


  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Referer': 'localhost:4200'
      //try lang why not
    })
  };

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  checkLoggedIn(): boolean {
   this.http.get(GETUser, this.httpOptions).subscribe({
    next: (response: any) => {
      console.log(response);
      this.isLoggedIn = true;
      return true;
    },
    error: (error: HttpErrorResponse) => {
      this.isLoggedIn = false;
      return false;
    }
   });
   return false;
  }

  getUser(): Observable<any> {
    return this.http.get<UserList>(GETUser, this.httpOptions);
  }

  initUser() {
    let user = this.getUser().pipe(map((response: any) => formatUser(response)))
  }

  postRegisterUser(data: FormData): Observable<any> {
    return this.http.post<Register>(POSTRegister, data, this.httpOptions);
  } 

  postLoginUser(data: FormData): Observable<any> {
    return this.http.post<Login>(POSTLogin, data, this.httpOptions);
  }

  /* mockLogin(email: String): void {
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
  } */
}
