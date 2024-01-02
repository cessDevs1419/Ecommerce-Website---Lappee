import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Error } from 'src/assets/models/error-response';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handle(err: HttpErrorResponse): string {
    let error: Error = err.error.data;
    //console.log(error)
    
    let key = Object.keys(error.error)[0];
   // console.log(key)
    return error.error[key][0];
  }
}
