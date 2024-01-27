// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      
      if (!this.authService.isAdmin()) {
        this.router.navigate(['/auth/login']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
