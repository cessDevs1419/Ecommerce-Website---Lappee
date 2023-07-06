import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
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
  loggedUser!: Observable<User[]>;

  user: User = {
    user_id: '',
    email: '',
    fname: '',
    mname: '',
    lname: '',
    suffix: '',
    created_at: '',
    last_login: '',
    user_type: 0,
  }


  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //try lang why not
    })
  };

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  checkLoggedIn(): boolean {
    let request = this.getUser();
    
    request.subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.user = {
          user_id: response.data.user_id,
          email: response.data.email,
          fname: response.data.fname,
          mname: response.data.mname,
          lname: response.data.lname,
          suffix: response.data.suffix,
          created_at: response.data.created_at,
          last_login: response.data.last_login,
          user_type: response.data.user_type,
        }

        console.log(this.user);
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
