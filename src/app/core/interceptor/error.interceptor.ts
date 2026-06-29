import { AuthService } from '../service/auth.service';
import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TabSessionCoordinatorService } from '../service/tab-session-coordinator.service';
import { SessionTokenService } from '../service/session-token.service';
import { SessionHeartbeatService } from '../service/session-heartbeat.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    private injector: Injector
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: unknown) => {
        const httpErr = err as HttpErrorResponse;
        if (httpErr?.status === 401 && !this.shouldSkipUnauthorizedHandling(request)) {
          return from(this.tryRefreshAndRetry(request, next, httpErr)).pipe(
            switchMap((result) => {
              if (result) {
                return result;
              }
              this.handleUnauthorizedLogout();
              return throwError(() => this.extractErrorText(httpErr));
            })
          );
        }

        return throwError(() => this.extractErrorText(httpErr));
      })
    );
  }

  private shouldSkipUnauthorizedHandling(request: HttpRequest<unknown>): boolean {
    const url = request.url.toLowerCase();
    return (
      url.includes('/auth/authenticate') ||
      url.includes('/auth/session-refresh') ||
      url.includes('/auth/session-end')
    );
  }

  private async tryRefreshAndRetry(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    httpErr: HttpErrorResponse
  ): Promise<Observable<HttpEvent<unknown>> | null> {
    if (request.headers.has('X-Session-Refresh-Retried')) {
      return null;
    }

    let sessionActive = false;
    try {
      sessionActive = this.injector.get(TabSessionCoordinatorService).isSessionActive();
    } catch {
      sessionActive = false;
    }

    if (!sessionActive) {
      return null;
    }

    const newToken = await this.injector.get(SessionTokenService).refreshToken();
    if (!newToken) {
      return null;
    }

    const retried = request.clone({
      setHeaders: {
        Authorization: `Bearer ${newToken}`,
        'X-Session-Refresh-Retried': '1',
      },
    });

    return next.handle(retried).pipe(
      catchError((retryErr: unknown) => throwError(() => this.extractErrorText(retryErr as HttpErrorResponse)))
    );
  }

  private handleUnauthorizedLogout(): void {
    try {
      this.injector.get(SessionHeartbeatService).handleSessionExpired();
    } catch {
      this.authenticationService.clearLocalSession();
      location.reload();
    }
  }

  private extractErrorText(httpErr: HttpErrorResponse): string {
    const msgFromBody =
      httpErr?.error &&
      typeof httpErr.error === 'object' &&
      httpErr.error !== null &&
      'message' in httpErr.error
        ? String((httpErr.error as { message?: unknown }).message ?? '')
        : '';
    return msgFromBody || httpErr?.statusText || 'Error';
  }
}
