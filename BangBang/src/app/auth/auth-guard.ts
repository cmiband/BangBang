import { inject } from '@angular/core';
import { Auth } from './auth';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; 
  }

  router.navigate(['/login']);
  return false;
};
