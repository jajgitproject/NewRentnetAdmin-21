// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

import { GeneralService } from '../general/general.service';
import { AuditTrailEvent, AuditTrailRow } from './auditTrail.model';

@Injectable()
export class AuditTrailService {
  private apiBase: string;

  constructor(
    private httpClient: HttpClient,
    private generalService: GeneralService
  ) {
    this.apiBase = this.generalService.BaseURL + 'auditTrail';
  }

  getEvents(
    userId: number | null,
    pageName: string,
    reservationId: number | null,
    pageNumber: number,
    pageSize: number,
    includeNullUser: boolean = true,
    fromDate: Date | null = null,
    toDate: Date | null = null
  ): Observable<AuditTrailEvent[]> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('includeNullUser', includeNullUser ? 'true' : 'false');

    // Empty string means "all pages" (backend treats it as NULL).
    params = params.set('pageName', pageName || '');

    if (userId != null) {
      params = params.set('userId', userId.toString());
    }
    if (reservationId != null) {
      params = params.set('reservationId', reservationId.toString());
    }
    if (fromDate) {
      params = params.set('fromDate', this.formatApiDate(fromDate));
    }
    if (toDate) {
      params = params.set('toDate', this.formatApiDate(toDate));
    }

    const timeoutMs = reservationId != null ? 120000 : 120000;
    return this.httpClient.get<AuditTrailEvent[]>(
      this.apiBase + '/events',
      { params }
    ).pipe(timeout(timeoutMs));
  }

  getRows(auditEventId: number, options?: { lite?: boolean }): Observable<AuditTrailRow[]> {
    let params = new HttpParams();
    if (options?.lite) {
      params = params.set('lite', 'true');
    }
    return this.httpClient.get<AuditTrailRow[]>(
      this.apiBase + '/events/' + auditEventId + '/rows',
      { params }
    );
  }

  private formatApiDate(value: Date): string {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}


