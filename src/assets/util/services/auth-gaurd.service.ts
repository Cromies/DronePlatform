import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
import { AuthService }      from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    public restricted: any = [];
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    this.restricted = route.data["restrict"];
    return this.checkLogin(url);

  }

  checkLogin(url: string): boolean {
    if (this.authService.checkLogin()) {
        if(this.checkLevel())
        {
            console.log('SUCCESS'); return true;
        }
        else
         {
            return false;
        }
      }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
  checkLevel(): boolean {
      console.log(this.authService.level);
      console.log(this.restricted);
      if(this.restricted != 'undefined'){
          if(this.restricted.includes(this.authService.level) ) {
              return false
          } else return true;
      }
      return true;
  }
}
