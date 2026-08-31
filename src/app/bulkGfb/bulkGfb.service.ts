import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  BulkGfbLimits,
  BulkGfbPreviewResult,
  BulkGfbRun,
  BulkGfbStartResult,
} from './bulkGfb.model';

export interface BulkGfbPreviewQuery {
  maxDuties: number;
  dutySlipIds?: string;
  reservationIds?: string;
  pickupDate?: string;
  customerId?: number;
  runStatus?: string;
  excludeDutySlipIds?: string;
  requireReadyForBulkGfb?: boolean;
}

@Injectable()
export class BulkGfbService {
  private apiUrl = '';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.apiUrl = generalService.BaseURL + 'bulkgfb';
  }

  getLimits(): Observable<BulkGfbLimits> {
    return this.httpClient.get<BulkGfbLimits>(`${this.apiUrl}/limits`);
  }

  preview(query: BulkGfbPreviewQuery): Observable<BulkGfbPreviewResult> {
    let params = new HttpParams().set('maxDuties', String(query.maxDuties || 500));
    if (query.dutySlipIds) {
      params = params.set('dutySlipIds', query.dutySlipIds);
    }
    if (query.reservationIds) {
      params = params.set('reservationIds', query.reservationIds);
    }
    if (query.pickupDate) {
      params = params.set('pickupDate', query.pickupDate);
    }
    if (query.customerId && query.customerId > 0) {
      params = params.set('customerId', String(query.customerId));
    }
    if (query.runStatus) {
      params = params.set('runStatus', query.runStatus);
    }
    if (query.excludeDutySlipIds) {
      params = params.set('excludeDutySlipIds', query.excludeDutySlipIds);
    }
    if (query.requireReadyForBulkGfb === false) {
      params = params.set('requireReadyForBulkGfb', 'false');
    }
    return this.httpClient.get<BulkGfbPreviewResult>(`${this.apiUrl}/preview`, { params });
  }

  startJob(
    maxDuties: number,
    performedBy: number,
    dutySlipIds: number[],
    requireReadyForBulkGfb = true
  ): Observable<BulkGfbStartResult> {
    return this.httpClient.post<BulkGfbStartResult>(`${this.apiUrl}/start`, {
      mode: 'Create',
      maxDuties,
      performedBy,
      dutySlipIds,
      requireReadyForBulkGfb,
    });
  }

  cancelJob(runId: number): Observable<{ cancelled: boolean }> {
    return this.httpClient.post<{ cancelled: boolean }>(`${this.apiUrl}/cancel/${runId}`, {});
  }

  getRun(runId: number): Observable<BulkGfbRun> {
    return this.httpClient.get<BulkGfbRun>(`${this.apiUrl}/runs/${runId}`);
  }

  listRuns(take = 10, batchDateFrom?: string, batchDateTo?: string): Observable<any> {
    let params = new HttpParams().set('take', String(take));
    if (batchDateFrom) {
      params = params.set('batchDateFrom', batchDateFrom);
    }
    if (batchDateTo) {
      params = params.set('batchDateTo', batchDateTo);
    }
    return this.httpClient.get(`${this.apiUrl}/recent`, { params });
  }

  downloadCsvUrl(runId: number): string {
    return `${this.apiUrl}/runs/${runId}/csv`;
  }
}
