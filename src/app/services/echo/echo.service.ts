import { Injectable } from '@angular/core';
import { CsrfService } from '../csrf/csrf.service';
import Echo from 'laravel-echo';

@Injectable({
  providedIn: 'root'
})
export class EchoService {

  channel: any;
  echo: any;

  token: string = this.csrf.getCsrfToken()
  constructor(private csrf: CsrfService) {

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'ABCDEFG',
      cluster: 'mt1',
      forceTLS: false,
      wsHost: window.location.hostname,
      wsPort: 6001,
      disableStats: true,
      authEndpoint: 'http://localhost:8000/laravel-websockets/auth',
      csrfToken: this.token,
      auth: {
        headers: {
          'X-XSRF-TOKEN': this.token,
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-APP-ID': '12345'
        },
      },
    })
    
  }

  listen(channel: string,event: string, callback: Function){
    this.echo.private(channel).listen(event, callback)
  }
}
