import { inject } from '@angular/core';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AccountsService } from '../accounts/accounts.service';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from 'src/assets/models/user';
import { HttpErrorResponse } from '@angular/common/http';

export function authGuard(route: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const accountService = inject(AccountsService);
    const router = inject(Router);
    let loginState$ = accountService.checkLoggedIn();
  
    console.log(route.url.toString() === 'account');
    console.log("Logged In? " + accountService.checkLoggedIn());
    console.log(route.url.toString());

    return loginState$.pipe(
      map((loginState: any) => {

        //not functional yet
        /* let isAdmin$ = accountService.getLoggedUser().pipe(
          map((user: User) => {
            if(user.user_type == 200) {
              return true;
            }
            else {
              return of(false);
            }
          }),
          catchError((err: HttpErrorResponse) => {
            return of(false);
          })
        ) */

        //console.log("isAdmin: " + isAdmin$);
        console.log("loginState: " + loginState);

        
        if(!loginState && (route.url.toString() != 'account' || route.url.toString() == 'admin') ){
          // redirect users not logged in
          console.log("Please log-in.");
          return router.parseUrl('/account');
        }

        /* if(loginState && !isAdmin$ && route.url.toString() == 'admin'){
          console.log('You lack privileges to access this page.');
          return router.parseUrl('/home');
        } */
        
        if(loginState && route.url.toString() === 'account'){
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