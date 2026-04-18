// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    includeNullUser: boolean = true
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

    return this.httpClient.get<AuditTrailEvent[]>(
      this.apiBase + '/events',
      { params }
    );
  }

  getRows(auditEventId: number): Observable<AuditTrailRow[]> {
    return this.httpClient.get<AuditTrailRow[]>(
      this.apiBase + '/events/' + auditEventId + '/rows'
    );
  }
}


