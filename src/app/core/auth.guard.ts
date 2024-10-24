// src/app/core/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const uid = authService.getUID();
  if (uid) {
    console.log('Acceso autorizado');
    return true;
  } else {
    console.warn('Acceso denegado: Redirigiendo al login');
    router.navigate(['/']);
    return false;
  }
};
