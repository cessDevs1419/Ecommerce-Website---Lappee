import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CsrfService } from "../csrf/csrf.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private csrf: CsrfService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        //remove when csrf is ready
        //return next.handle(req);

        // get saved token from service
        let token = this.csrf.getCsrfToken();

        // sabi sa docs ng angular sa mga request na nagmomodify lang daw inaattach yung xsrf
        if(req.method == 'POST'){
            const clone = req.clone({
                headers: req.headers.set("X-XSRF-TOKEN", token),
                withCredentials: true
            })

            return next.handle(clone);
        }

        // ignore non-post requests
        return next.handle(req);
        
    }
}