import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

import { LoggedUser } from '../models/loggedUserModel';

@Injectable()
export class LoginGuardService implements CanActivate {
  constructor(public userService: UserService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = route.data.expectedRole;
    return this.userService.isAuthenticated().then((loginInf: LoggedUser) => {
      if (loginInf.isLogin && expectedRole === loginInf.role) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    });
  }
}
