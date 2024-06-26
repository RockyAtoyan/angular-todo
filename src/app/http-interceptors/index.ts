import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APIInterceptor } from './APIInterceptor';
import { AuthInterceptor } from './AuthInterceptor';
import { PendingInterceptor } from './PendingInterceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: PendingInterceptor, multi: true },
];
