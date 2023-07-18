import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BannedUserList, User, UserList } from 'src/assets/models/user';
import { GETBanUsers, GETUsers, POSTBanUsers } from '../endpoints';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

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
  
  banUsers(data: FormData): Observable<any> {
    return this.http.post<User>(POSTBanUsers, data, this.httpOptions);
  } 
  
  unbanUsers(userId: number): Observable<any> {
    return this.http.post(POSTBanUsers, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'json',
      body: {
          id: userId
        }
    })
  } 
}
