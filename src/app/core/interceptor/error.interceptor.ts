import { AuthService } from '../service/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: unknown) => {
        const httpErr = err as HttpErrorResponse;
        if (httpErr?.status === 401) {
          this.authenticationService.logout();
          location.reload();
        }

        const msgFromBody =
          httpErr?.error &&
          typeof httpErr.error === 'object' &&
          httpErr.error !== null &&
          'message' in httpErr.error
            ? String((httpErr.error as { message?: unknown }).message ?? '')
            : '';
        const errorText = msgFromBody || httpErr?.statusText || 'Error';
        return throwError(() => errorText);
      })
    );
  }
}
