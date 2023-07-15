import { inject } from '@angular/core';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AccountsService } from '../accounts/accounts.service';
import { Observable, map, of } from 'rxjs';

export function authGuard(route: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const accountService = inject(AccountsService);
    const router = inject(Router);
    let loginState$ = accountService.checkLoggedIn();
  
    console.log(route.url.toString() === 'account');
    console.log("Logged In? " + accountService.checkLoggedIn());
    console.log(route.url.toString());

    return loginState$.pipe(
      map((loginState: any) => {
        if(!loginState && route.url.toString() != 'account'){
          console.log("Please log-in.");
          return router.parseUrl('/account');
        }

        if (loginState && route.url.toString() === 'account'){
          // redirect FROM account page if logged in
          console.log('You are already logged in.')
          return router.parseUrl('/home');
        }
    
        return true;
      })
    )
  
   /* if(!loginState$ && route.url.toString() != 'account') {
      // not logged in
      console.log("Please log-in.");
      return new Observable<boolean | UrlTree>(observer => {
        observer.next(router.parseUrl('/account'));
        observer.complete();
      });
    }
    
    if(loginState$ && route.url.toString() === 'account'){
      // logged in and in account page
      console.log('You are already logged in.')
      return new Observable<boolean | UrlTree>(observer => {
        observer.next(router.parseUrl('/home'));
        observer.complete();
      });
    }
  
    return new Observable<boolean | UrlTree>(observer => {
      observer.next(true);
      observer.complete();
    }); */
} 