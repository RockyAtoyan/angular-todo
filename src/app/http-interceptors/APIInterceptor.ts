import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');
    const apiReq = req.clone({
      url: `${environment.apiUrl}${req.url}`,
      withCredentials: true,
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next.handle(apiReq);
  }
}
