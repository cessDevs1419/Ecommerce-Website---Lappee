import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const token = null;
        if(token){
            const clone = req.clone({
                headers: req.headers.set("Authorization", token)
            })

            return next.handle(clone);
        }
        else {
            return next.handle(req);
        }
    }

}