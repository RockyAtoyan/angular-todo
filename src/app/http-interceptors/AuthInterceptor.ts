import { catchError, switchMap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { ServerService } from '../server.service';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private server: ServerService,
    private authService: AuthService,
  ) {}

  intercept(request: HttpRequest<any> & { sent?: boolean }, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message !== 'refresh_token') {
          return this.handle401Error(request, next);
        } else {
          if (error.error.message !== 'refresh_token') {
            this.authService.openSnackbar(
              error.error.message || 'Error!',
              'error',
            );
          }
          return throwError(error);
        }
      }),
    );
  }

  private handle401Error(
    request: HttpRequest<any> & { sent?: boolean },
    next: HttpHandler,
  ) {
    return this.server.auth().pipe(
      switchMap((response: any) => {
        localStorage.setItem('accessToken', response.accessToken);
        return next.handle(request);
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.authService.userSignal.set(null);
        } else {
          this.authService.openSnackbar(
            error.error.message || 'Error!',
            'error',
          );
        }
        return throwError(error);
      }),
    );
  }
}
