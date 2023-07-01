import { inject } from '@angular/core';
import {  Router } from '@angular/router';
import { AccountsService } from '../accounts/accounts.service';

export const authGuard = () => {
  const accountService = inject(AccountsService);
  const router = inject(Router);

  if(!accountService.getIsLoggedIn()) {
    console.log("Please log-in.");
    return router.parseUrl('/account');
  }

  return true;
  
}
