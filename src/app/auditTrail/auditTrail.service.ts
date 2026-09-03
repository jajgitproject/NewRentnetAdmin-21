import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

import { GeneralService } from '../general/general.service';
import { AuditTrailEvent, AuditTrailNlpQueryResponse } from './auditTrail.model';

@Injectable()
export class AuditTrailService {
  private apiBase: string;

  constructor(
    private httpClient: HttpClient,
    private generalService: GeneralService
  ) {
    this.apiBase = this.generalService.BaseURL + 'reservationAllotmentAudit';
  }

  getEvents(
    module: string,
    reservationId: number | null,
    allotmentId: number | null,
    userId: number | null,
    fromDate: Date | null,
    toDate: Date | null,
    pageNumber: number,
    pageSize: number,
    operation?: string | null,
    searchText?: string | null
  ): Observable<AuditTrailEvent[]> {
    let params = new HttpParams()
      .set('pageNumber', String(pageNumber))
      .set('pageSize', String(pageSize));

    if (module) {
      params = params.set('module', module);
    }
    if (reservationId != null) {
      params = params.set('reservationId', String(reservationId));
    }
    if (allotmentId != null) {
      params = params.set('allotmentId', String(allotmentId));
    }
    if (userId != null) {
      params = params.set('userId', String(userId));
    }
    if (fromDate) {
      params = params.set('fromDate', this.formatApiDate(fromDate));
    }
    if (toDate) {
      params = params.set('toDate', this.formatApiDate(toDate));
    }
    if (operation) {
      params = params.set('operation', operation);
    }
    if (searchText) {
      params = params.set('searchText', searchText);
    }

    return this.httpClient
      .get<AuditTrailEvent[]>(this.apiBase + '/events', { params })
      .pipe(timeout(120000));
  }

  queryEvents(q: string, pageNumber: number, pageSize: number): Observable<AuditTrailNlpQueryResponse> {
    return this.httpClient
      .post<AuditTrailNlpQueryResponse>(this.apiBase + '/events/query', {
        q,
        pageNumber,
        pageSize
      })
      .pipe(timeout(120000));
  }

  getEvent(eventId: string): Observable<AuditTrailEvent> {
    return this.httpClient.get<AuditTrailEvent>(
      this.apiBase + '/events/' + encodeURIComponent(eventId)
    );
  }

  private formatApiDate(value: Date): string {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
