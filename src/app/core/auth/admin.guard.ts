import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  if (!authService.isLoggedIn()) {
    router.navigate(['/']);
    snackBar.open('Please log in to access this page', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    return false;
  }

  if (!authService.isAdmin()) {
    router.navigate(['/']);
    snackBar.open('Not authorized. Admin access required.', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    return false;
  }

  return true;
};

