import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CsrfService } from "../csrf/csrf.service";
import { AccountsService } from "../accounts/accounts.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private csrf: CsrfService, private account: AccountsService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // get saved token from service
        let token = this.csrf.getCsrfToken();
        let reqWithCredentials = req.clone({
            withCredentials: true
        });

        if(this.account.getIsLoggedIn()){
        }

        // sabi sa docs ng angular sa mga request na nagmomodify lang daw inaattach yung xsrf
        if(req.method == 'POST' || req.method == 'PATCH' || req.method == 'DELETE'){
            const clone = req.clone({
                headers: req.headers.set("X-XSRF-TOKEN", token),
                withCredentials: true
            })

            return next.handle(clone);
        }

        // ignore non-post requests
        return next.handle(reqWithCredentials);
        
    }
}