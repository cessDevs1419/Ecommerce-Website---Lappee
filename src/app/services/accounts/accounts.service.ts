import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, catchError, map, of, pipe, throwError } from 'rxjs';
import { Register, Login } from 'src/assets/models/account';
import { POSTRegister, POSTLogin, GETUser, POSTLogout } from '../endpoints';
import { CookieService } from 'ngx-cookie-service';
import { User, UserList } from 'src/assets/models/user';
import { formatUser } from 'src/app/utilities/response-utils';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private isLoggedIn: boolean = false;
  loggedUser: Observable<User>;

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
  
  tempaddress = {
    province: 'Cavite',
    city: 'Dasmarinas',
    zip: '4114',
    addressline: '6-4 I.Mangubat St, Zone IV'
  }

  fullName: string = this.user.fname + " " + (this.user.mname ? this.user.mname : "") + " " + this.user.lname + " " + (this.user.suffix ? this.user.suffix : "");
  fullAddress: string = this.tempaddress.addressline + ", " + this.tempaddress.city + " City, " + this.tempaddress.province + ", " + this.tempaddress.zip;


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

  getLoggedUser(): Observable<User> {
    return this.loggedUser;
  }

  checkLoggedIn(): Observable<boolean> {
    /* return this.getUser().subscribe(
      pipe(
        map((response: User) => {
          this.loggedUser = this.bindUser(response);
        
          console.log(this.user);
          this.isLoggedIn = true;
          return true;
        }),
        catchError((err: any) => {
          this.isLoggedIn = false;
        console.log(err);
        return of(false)
        })
      )
    ); */
    return this.getUser().pipe(
      map((response: User) => {
        console.log(response);
        this.loggedUser = this.bindUser(response);
        
        console.log(this.user);
        this.isLoggedIn = true;
        return true;
      }),
      catchError((err: any) => {
        this.isLoggedIn = false;
        console.log(err);
        return of(false)
      })
    )
  }

  bindUser(response: any): Observable<User> {
    return of({
        user_id: response.data.user_id,
        email: response.data.email,
        fname: response.data.fname,
        mname: response.data.mname,
        lname: response.data.lname,
        suffix: response.data.suffix,
        created_at: response.data.created_at,
        last_login: response.data.last_login,
        user_type: response.data.user_type
    });
  }

  logoutUser(): Observable<any> {
    return this.postLogout().pipe(
      map((response: any) => {
        this.user = {
          user_id: '',
          email: '',
          fname: '',
          mname: '',
          lname: '',
          suffix: '',
          created_at: '',
          last_login: '',
          user_type: 0,
        };
        this.isLoggedIn = false;
        this.loggedUser = of({
          user_id: '',
          email: '',
          fname: '',
          mname: '',
          lname: '',
          suffix: '',
          created_at: '',
          last_login: '',
          user_type: 0
        })
      })
    ); 
  }

  /* checkLoggedIn(): Observable<any> {
    return 
  } */

  // HTTP Client

  getUser(): Observable<any> {
    return this.http.get<UserList>(GETUser, this.httpOptions);
  }

  postRegisterUser(data: FormData): Observable<any> {
    return this.http.post<Register>(POSTRegister, data, this.httpOptions);
  } 

  postLoginUser(data: FormData): Observable<any> {
    return this.http.post<Login>(POSTLogin, data, this.httpOptions);
  }

  postLogout(): Observable<any> {
    return this.http.post(POSTLogout, this.httpOptions);
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
