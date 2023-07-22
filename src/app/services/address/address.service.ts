import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressList } from 'src/assets/models/address';
import { GETAddresses, POSTAddress } from '../endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  };

  constructor(private http: HttpClient) { }

  getAddresses(): Observable<any> {
    return this.http.get<AddressList>(GETAddresses)
  }

  postAddress(form: FormData): Observable<any> {
    return this.http.post(POSTAddress, form, this.httpOptions);
  }
}
