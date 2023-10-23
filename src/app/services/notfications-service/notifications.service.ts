import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminNotification, AdminNotificationList } from 'src/assets/models/admin-notifications';
import { GETNotifications, PATCHNotifications } from '../endpoints';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
      //galing kay dell
    })
  };
  
  
  getNotifications(): Observable<AdminNotification[]> {
    return this.http.get<AdminNotification[]>(GETNotifications);
  }

  getNotificationsList(): Observable<AdminNotificationList> {
    return this.http.get<AdminNotificationList>(GETNotifications);
  }

  // patchNotifications(id: string): Observable<any> {
  //   return this.http.patch(PATCHNotifications, {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Credentials': 'true'
  //     }),
  //     responseType: 'json',
  //     body: {
  //       id: id 
  //     }
  //   })
  // }
  
  patchNotifications(id: string): Observable<any> {
    const body = { id: id }; // Define the request body with the 'id' field
  
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    });
  
    return this.http.patch(PATCHNotifications, body, { headers: headers });
  }
  
}
