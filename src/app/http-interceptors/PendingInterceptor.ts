import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { PendingService } from '../pending.service';

@Injectable()
export class PendingInterceptor implements HttpInterceptor {
  private count = 0;

  constructor(private loaderService: PendingService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.includes('isNot')) this.loaderService.isLoading.next(true);
    this.count++;
    return next.handle(request).pipe(
      delay(0),
      finalize(() => {
        this.count--;
        if (this.count === 0) {
          this.loaderService.isLoading.next(false);
        }
      })
    );
  }
}
