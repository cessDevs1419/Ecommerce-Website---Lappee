import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GETVerifyEmail } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  public verifyEmail(id: string, token: string){
    return this.http.get(GETVerifyEmail + "/" + id + "/" + token)
  }
}
