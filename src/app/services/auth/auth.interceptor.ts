import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CsrfService } from "../csrf/csrf.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private csrf: CsrfService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        //remove when csrf is ready
        return next.handle(req);

        /* const token = this.csrf.getToken();
        console.log(token);
        if(token){
            const clone = req.clone({
                headers: req.headers.set("X-XSRF-TOKEN", "")
            })

            console.log(token);
            return next.handle(clone);
        }
        else {
            return next.handle(req);
        } */
    }
}