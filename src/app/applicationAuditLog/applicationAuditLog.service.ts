// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

import { GeneralService } from '../general/general.service';
import { ApplicationAuditLogEvent } from './applicationAuditLog.model';

@Injectable()
export class ApplicationAuditLogService {
  private apiBase: string;

  constructor(
    private httpClient: HttpClient,
    private generalService: GeneralService
  ) {
    this.apiBase = this.generalService.BaseURL + 'applicationAudit';
  }

  getEvents(
    userId: number | null,
    formName: string,
    operation: string,
    reservationId: number | null,
    recordId: string,
    fromDate: Date | null,
    toDate: Date | null,
    pageNumber: number,
    pageSize: number
  ): Observable<ApplicationAuditLogEvent[]> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('formName', formName || '');

    if (userId != null) {
      params = params.set('userId', userId.toString());
    }
    if (operation) {
      params = params.set('operation', operation);
    }
    if (reservationId != null) {
      params = params.set('reservationId', reservationId.toString());
    }
    if (recordId) {
      params = params.set('recordId', recordId);
    }
    if (fromDate) {
      params = params.set('fromDate', this.formatApiDate(fromDate));
    }
    if (toDate) {
      params = params.set('toDate', this.formatApiDate(toDate));
    }

    return this.httpClient
      .get<ApplicationAuditLogEvent[]>(this.apiBase + '/events', { params })
      .pipe(timeout(120000));
  }

  getEvent(eventId: string): Observable<ApplicationAuditLogEvent> {
    return this.httpClient.get<ApplicationAuditLogEvent>(
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
