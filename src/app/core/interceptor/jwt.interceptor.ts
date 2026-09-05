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
      const empId =
        (currentUser as any)?.employee?.EmployeeID ??
        (currentUser as any)?.employee?.employeeID ??
        (currentUser as any)?.Employee?.EmployeeID ??
        (currentUser as any)?.Employee?.employeeID ??
        (currentUser as any)?.EmployeeID ??
        (currentUser as any)?.employeeID;
      const sessionGuid = (currentUser as any)?.SessionGuid ?? (currentUser as any)?.sessionGuid;
      let reservationId = '';
      try {
        reservationId = sessionStorage.getItem('audit_reservationId') || '';
      } catch {}
      const bodyReservationId =
        request.body?.reservationID ??
        request.body?.ReservationID ??
        '';
      const auditReservationId = String(bodyReservationId || reservationId || '').trim();
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${bearer}`,
          'X-Audit-FormName': routeFormName,
          ...(empId ? { 'X-Audit-UserId': String(empId) } : {}),
          ...(sessionGuid ? { 'X-Session-Guid': String(sessionGuid) } : {}),
          ...(auditReservationId && /^\d+$/.test(auditReservationId)
            ? { 'X-Audit-ReservationId': auditReservationId }
            : {}),
        },
      });
    } else if (routeFormName) {
      let reservationId = '';
      try {
        reservationId = sessionStorage.getItem('audit_reservationId') || '';
      } catch {}
      request = request.clone({
        setHeaders: {
          'X-Audit-FormName': routeFormName,
          ...(reservationId && /^\d+$/.test(reservationId)
            ? { 'X-Audit-ReservationId': reservationId }
            : {}),
        },
      });
    }

    return next.handle(request);
  }
}

