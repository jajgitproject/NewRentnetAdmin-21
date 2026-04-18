// @ts-nocheck
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { PageAuditDropDown } from 'src/app/auditTrail/pageAuditDropDown.model';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let currentUser = this.authenticationService.currentUserValue;
    const rawUrl = (this.router?.url || '').split('?')[0].replace('#', '').trim();
    const routeKey = rawUrl.replace(/^\//, '').split('/')[0]?.trim() || '';

    let routeFormName = routeKey;
    try {
      const cached = sessionStorage.getItem('audit_pages');
      if (cached) {
        const pages = JSON.parse(cached) as PageAuditDropDown[];
        const match = (pages || []).find(p => (p.path || '').toLowerCase() === routeKey.toLowerCase());
        if (match && match.page) {
          routeFormName = match.page;
        }
      }
    } catch {}

    const bearer =
      currentUser &&
      ((currentUser as any).Token ?? (currentUser as any).token);
    if (currentUser && bearer) {
      const empId = (currentUser as any)?.employee?.EmployeeID;
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${bearer}`,
          'X-Audit-FormName': routeFormName,
          ...(empId ? { 'X-Audit-UserId': String(empId) } : {}),
        },
      });
    } else if (routeFormName) {
      request = request.clone({
        setHeaders: {
          'X-Audit-FormName': routeFormName,
        },
      });
    }

    return next.handle(request);
  }
}

