import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserList } from 'src/assets/models/user';
import { GETUsers } from '../endpoints';
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
}
