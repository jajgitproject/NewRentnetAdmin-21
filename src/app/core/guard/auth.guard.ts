import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const user = this.authService.currentUserValue as any;
    const token = user?.Token ?? user?.token;
    const employee = user?.employee ?? user?.Employee;
    if (token && employee && this.authService.isOtpVerified()) {
      return true;
    }
    void this.router.navigate(['/authentication/signin']);
    return false;
  }
}
