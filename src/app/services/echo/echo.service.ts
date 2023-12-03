import { Injectable } from '@angular/core';
import { CsrfService } from '../csrf/csrf.service';
import Echo from 'laravel-echo';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EchoService {

  channel: any;
  echo: any;

  token: string = this.csrf.getCsrfToken()
  constructor(private csrf: CsrfService, private http: HttpClient) {

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.PUSHER_APP_KEY,
      cluster: environment.PUSHER_APP_CLUSTER,
      forceTLS: false,
      authorizer: (channel: any, options: any) => {
        return {
          authorize: (socketId: any, callback: any) => {
            this.http.post('http://localhost:8000/api/broadcasting/auth', {
              socket_id: socketId,
              channel_name: channel.name
            }, {
              withCredentials: true,
              headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-APP-ID': '12345'
              }
            },).subscribe({
              next: (response: any) => {
                callback(null, response)
              },
              error: (response: any) => {
                callback(response);
              }
            });
          }
        }
      }
    })
    
  }

  listen(channel: string,event: string, callback: Function){
    this.echo.private(channel).listen(event, callback)
  }

  disconnect() {
    this.echo.disconnect();
  }

}
