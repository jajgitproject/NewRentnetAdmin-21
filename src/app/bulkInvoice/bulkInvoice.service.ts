import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  BulkInvoiceLimits,
  BulkInvoicePreviewResult,
  BulkInvoiceRun,
  BulkInvoiceStartResult,
  MarkReadyForBulkBillingPreviewResult,
} from './bulkInvoice.model';

export interface BulkInvoicePreviewQuery {
  maxDuties: number;
  mode?: string;
  dutySlipIds?: string;
  reservationIds?: string;
  pickupDate?: string;
  customerId?: number;
  runStatus?: string;
  excludeDutySlipIds?: string;
}

export interface MarkReadyForBulkBillingQuery {
  batchDate?: string;
  bulkGfbBatchId?: number;
  dutySlipIds?: string;
  reservationIds?: string;
  customerId?: number;
}

@Injectable()
export class BulkInvoiceService {
  private apiUrl = '';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.apiUrl = generalService.BaseURL + 'bulkinvoice';
  }

  getLimits(): Observable<BulkInvoiceLimits> {
    return this.httpClient.get<BulkInvoiceLimits>(`${this.apiUrl}/limits`);
  }

  preview(query: BulkInvoicePreviewQuery): Observable<BulkInvoicePreviewResult> {
    let params = new HttpParams().set('maxDuties', String(query.maxDuties || 25));
    if (query.mode) {
      params = params.set('mode', query.mode);
    }
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
    return this.httpClient.get<BulkInvoicePreviewResult>(`${this.apiUrl}/preview`, { params });
  }

  startJob(
    maxDuties: number,
    performedBy: number,
    dutySlipIds: number[],
    mode: string
  ): Observable<BulkInvoiceStartResult> {
    return this.httpClient.post<BulkInvoiceStartResult>(`${this.apiUrl}/start`, {
      mode,
      maxDuties,
      performedBy,
      dutySlipIds,
    });
  }

  cancelJob(runId: number): Observable<{ cancelled: boolean }> {
    return this.httpClient.post<{ cancelled: boolean }>(`${this.apiUrl}/cancel/${runId}`, {});
  }

  getRun(runId: number): Observable<BulkInvoiceRun> {
    return this.httpClient.get<BulkInvoiceRun>(`${this.apiUrl}/runs/${runId}`);
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

  previewMarkTag(query: MarkReadyForBulkBillingQuery): Observable<MarkReadyForBulkBillingPreviewResult> {
    let params = new HttpParams();
    if (query.batchDate) {
      params = params.set('batchDate', query.batchDate);
    }
    if (query.bulkGfbBatchId && query.bulkGfbBatchId > 0) {
      params = params.set('bulkGfbBatchId', String(query.bulkGfbBatchId));
    }
    if (query.dutySlipIds) {
      params = params.set('dutySlipIds', query.dutySlipIds);
    }
    if (query.reservationIds) {
      params = params.set('reservationIds', query.reservationIds);
    }
    if (query.customerId && query.customerId > 0) {
      params = params.set('customerId', String(query.customerId));
    }
    return this.httpClient.get<MarkReadyForBulkBillingPreviewResult>(`${this.apiUrl}/mark-preview`, { params });
  }

  setTag(dutySlipID: number, readyForBulkBilling: boolean, performedBy: number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/set-tag`, {
      dutySlipID,
      readyForBulkBilling,
      performedBy,
    });
  }

  setTags(dutySlipIds: number[], readyForBulkBilling: boolean, performedBy: number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/set-tags`, {
      dutySlipIds,
      readyForBulkBilling,
      performedBy,
    });
  }
}
