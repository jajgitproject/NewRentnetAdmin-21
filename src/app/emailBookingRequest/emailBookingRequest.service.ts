import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GeneralService } from '../general/general.service';
import {
  EmailBookingClerkEfficiencyRow,
  EmailBookingConfirmPayload,
  EmailBookingQueueCounts,
  EmailBookingFindReservationsPayload,
  EmailBookingRequestDetail,
  EmailBookingRequestListItem,
  EmailBookingReservationCandidate,
  EmailBookingSettings
} from './emailBookingRequest.model';

@Injectable()
export class EmailBookingRequestService {
  private apiBase: string;

  constructor(
    private http: HttpClient,
    private generalService: GeneralService
  ) {
    this.apiBase = this.generalService.BaseURL + 'emailBookingAI';
  }

  search(
    fromDate: string | null,
    toDate: string | null,
    trn: string | null,
    status: string | null,
    pageNumber: number,
    view: string = 'queue'
  ): Observable<EmailBookingRequestListItem[]> {
    let params = new HttpParams()
      .set('pageNumber', String(pageNumber || 1))
      .set('viewerUserId', String(this.generalService.getUserID() || 0))
      .set('view', view || 'queue');
    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }
    if (trn) {
      params = params.set('trn', trn);
    }
    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    return this.http.get<EmailBookingRequestListItem[]>(this.apiBase + '/requests', { params });
  }

  getById(id: number): Observable<EmailBookingRequestDetail> {
    return this.http.get<EmailBookingRequestDetail>(this.apiBase + '/requests/' + id);
  }

  downloadAttachment(requestId: number, attachmentId: number): Observable<Blob> {
    return this.http.get(this.apiBase + '/requests/' + requestId + '/attachments/' + attachmentId, {
      responseType: 'blob'
    });
  }

  confirm(payload: EmailBookingConfirmPayload): Observable<{
    result: string;
    reservationID?: number;
    integrationRequestID?: number;
    reservationEmailAIID?: number;
    continueLoop?: boolean;
    createdReservationCount?: number;
    expectedReservationCount?: number;
  }> {
    return this.http.post<{
      result: string;
      reservationID?: number;
      integrationRequestID?: number;
      reservationEmailAIID?: number;
      continueLoop?: boolean;
      createdReservationCount?: number;
      expectedReservationCount?: number;
    }>(this.apiBase + '/confirm', payload);
  }

  classify(
    emailBookingRequestId: number,
    emailCategory: string,
    matchedHistoricalReservationId?: number | null
  ): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(this.apiBase + '/classify', {
      emailBookingRequestId,
      emailCategory,
      matchedHistoricalReservationId: matchedHistoricalReservationId || undefined,
      userID: this.generalService.getUserID()
    });
  }

  findReservations(
    payload: EmailBookingFindReservationsPayload
  ): Observable<EmailBookingReservationCandidate[]> {
    return this.http.post<EmailBookingReservationCandidate[]>(this.apiBase + '/findReservations', payload);
  }

  reject(id: number, reason: string): Observable<{ result: string }> {
    let params = new HttpParams();
    if (reason) {
      params = params.set('reason', reason);
    }
    params = params.set('userId', String(this.generalService.getUserID() || 0));
    return this.http.delete<{ result: string }>(this.apiBase + '/requests/' + id, { params });
  }

  claimNext(): Observable<{ result: string; emailBookingRequestId: number }> {
    return this.http.post<{ result: string; emailBookingRequestId: number }>(this.apiBase + '/claimNext', {
      userID: this.generalService.getUserID()
    });
  }

  claim(emailBookingRequestId: number): Observable<{ result: string; emailBookingRequestId: number }> {
    return this.http.post<{ result: string; emailBookingRequestId: number }>(this.apiBase + '/claim', {
      emailBookingRequestId,
      userID: this.generalService.getUserID()
    });
  }

  heartbeat(emailBookingRequestId: number): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(this.apiBase + '/heartbeat', {
      emailBookingRequestId,
      userID: this.generalService.getUserID()
    });
  }

  release(emailBookingRequestId: number): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(this.apiBase + '/release', {
      emailBookingRequestId,
      userID: this.generalService.getUserID()
    });
  }

  queueCounts(): Observable<EmailBookingQueueCounts> {
    return this.http.get<EmailBookingQueueCounts>(this.apiBase + '/queueCounts');
  }

  clerkEfficiency(fromDate: string | null, toDate: string | null): Observable<EmailBookingClerkEfficiencyRow[]> {
    let params = new HttpParams();
    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }
    return this.http.get<EmailBookingClerkEfficiencyRow[]>(this.apiBase + '/clerkEfficiency', { params });
  }

  settings(): Observable<EmailBookingSettings> {
    return this.http.get<EmailBookingSettings>(this.apiBase + '/settings');
  }

  requestDetails(payload: {
    emailBookingRequestId: number;
    toAddresses: string;
    subject: string;
    body: string;
  }): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(this.apiBase + '/requestDetails', {
      ...payload,
      userID: this.generalService.getUserID()
    });
  }

  pollNow(): Observable<{ result: string; processed?: number; mailbox?: string }> {
    return this.http.post<{ result: string; processed?: number; mailbox?: string }>(
      this.apiBase + '/pollNow',
      {}
    );
  }

  ingestTest(
    subject: string,
    fromAddress: string,
    body: string,
    dateOfEmail?: string | null
  ): Observable<{ result: string; emailBookingRequestId: number }> {
    return this.http.post<{ result: string; emailBookingRequestId: number }>(this.apiBase + '/ingestTest', {
      subject,
      fromAddress,
      body,
      dateOfEmail: dateOfEmail || undefined
    });
  }
}
