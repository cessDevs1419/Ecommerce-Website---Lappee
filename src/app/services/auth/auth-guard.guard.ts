import { inject } from '@angular/core';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AccountsService } from '../accounts/accounts.service';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { User } from 'src/assets/models/user';
import { HttpErrorResponse } from '@angular/common/http';

export function authGuard(route: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const accountService = inject(AccountsService);
    const router = inject(Router);
    let loginState$ = accountService.checkLoggedIn();

    return loginState$.pipe(
      switchMap((loginState: any) => {
        console.log(route.url);
        // (!loginState && (route.url.toString() === 'profile' || route.url.toString() === 'admin' || route.url[0].toString() === 'verify-email'))
        if (!loginState && (route.url.toString() === 'profile' || route.url.toString() === 'admin')) {
          // redirect users not logged in
          console.log("Please log-in.");
          return of(router.parseUrl('/login'));
        }

        if(!loginState){
          // allow non-logged-in users
          return of(true);
        }

        return accountService.getLoggedUser().pipe(
          map((user: User) => {
            // if(loginState && route.url[0].toString() === 'verify-email'){
            //   return true;
            // }

            if(user.user_type === 100 && route.url.toString() === 'admin'){
              // redirect normal users from accessing admin
              console.log('You lack privileges to access this page.');
              return router.parseUrl('/home');
            }
            else if(user.user_type === 200 && route.url.toString() === 'admin'){
              // let admin users access admin page
              return true;
            }
            else if(loginState && (route.url.toString() === 'login' || route.url.toString() === 'register')){
              // redirect logged-in users from account page
              return router.parseUrl('/home');
            }

            return true
          })
        );
      })
    );


    // This version only checks if the user is logged in or not, it does not check for user_type
    /* return loginState$.pipe(
      map((loginState: any) => {

        console.log("loginState: " + loginState);
        
        if(!loginState && (route.url.toString() != 'account' || route.url.toString() == 'admin') ){
          // redirect users not logged in
          console.log("Please log-in.");
          return router.parseUrl('/account');
        }

        /* if(loginState && !isAdmin$ && route.url.toString() == 'admin'){
          console.log('You lack privileges to access this page.');
          return router.parseUrl('/home');
        }
        
        if(loginState && route.url.toString() === 'account'){
          // redirect FROM account page if logged in
          console.log('You are already logged in.')
          return router.parseUrl('/home');
        }

        return true;
      })
    ) */
} 