import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BannedUserList, User, UserList } from 'src/assets/models/user';
import { DELETEBanUsers, GETActiveAdmin, GETActiveCustomers, GETActiveUsers, GETBanUsers, GETInactiveAdmin, GETInactiveCustomers, GETInactiveUsers, GETUsers, POSTBanUsers } from '../endpoints';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private data: any[] = []
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  };

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserList> {
    return this.http.get<UserList>(GETUsers, this.httpOptions);
  }

  getbannedUsers(): Observable<BannedUserList> {
    return this.http.get<BannedUserList>(GETBanUsers, this.httpOptions);
  }
  
  getActiveAdmin(): Observable<any> {
    return this.http.get<UserList>(GETActiveAdmin, this.httpOptions);
  }
  getInactiveAdmin(): Observable<any> {
    return this.http.get<UserList>(GETInactiveAdmin, this.httpOptions);
  }
  getActiveUser(): Observable<any> {
    return this.http.get<UserList>(GETActiveUsers, this.httpOptions);
  }
  getInactiveUser(): Observable<any> {
    return this.http.get<UserList>(GETInactiveUsers, this.httpOptions);
  }
  getActiveCustomer(): Observable<any> {
    return this.http.get<UserList>(GETActiveCustomers, this.httpOptions);
  }
  getInactiveCustomer(): Observable<any> {
    return this.http.get<UserList>(GETInactiveCustomers, this.httpOptions);
  }
  
  banUsers(data: FormData): Observable<any> {
    return this.http.post<User>(POSTBanUsers, data, this.httpOptions);
  } 
  
  unbanUsers(userId: number): Observable<any> {
    return this.http.delete(DELETEBanUsers, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: {
          user_id: userId
        }
    })
  } 

  openedAccount(data: any){
    this.data.push(data)
  }
}
