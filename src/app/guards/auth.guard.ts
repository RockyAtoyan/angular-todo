import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  private isAuth() {
    return this.authService.isAuthenticated();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | boolean {
    if (this.authService.userSignal()) {
      return true;
    }
    return new Observable<boolean>((subscriber) => {
      this.authService.isAuthenticated().subscribe(
        (value) => {
          subscriber.next(value);
        },
        (error) => {
          const callbackUrl = state.url;
          this.router.navigate(['/login'], {
            queryParams: callbackUrl ? { callbackUrl } : {},
          });
          subscriber.next(false);
        },
        () => {
          subscriber.complete();
        },
      );
    });
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
