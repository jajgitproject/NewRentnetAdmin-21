import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  BulkCreditNoteLimits,
  BulkCreditNotePreviewResult,
  BulkCreditNoteRun,
  BulkCreditNoteStartResult,
} from './bulkCreditNote.model';

export interface BulkCreditNotePreviewQuery {
  maxInvoices: number;
  customerId?: number;
  invoiceNumber?: string;
  fromDate?: string;
  toDate?: string;
  excludeInvoiceIds?: string;
}

@Injectable()
export class BulkCreditNoteService {
  private apiUrl = '';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.apiUrl = generalService.BaseURL + 'bulkcreditnote';
  }

  getLimits(): Observable<BulkCreditNoteLimits> {
    return this.httpClient.get<BulkCreditNoteLimits>(`${this.apiUrl}/limits`);
  }

  preview(query: BulkCreditNotePreviewQuery): Observable<BulkCreditNotePreviewResult> {
    let params = new HttpParams().set('maxInvoices', String(query.maxInvoices || 50));
    if (query.customerId && query.customerId > 0) {
      params = params.set('customerId', String(query.customerId));
    }
    if (query.invoiceNumber) {
      params = params.set('invoiceNumber', query.invoiceNumber);
    }
    if (query.fromDate) {
      params = params.set('fromDate', query.fromDate);
    }
    if (query.toDate) {
      params = params.set('toDate', query.toDate);
    }
    if (query.excludeInvoiceIds) {
      params = params.set('excludeInvoiceIds', query.excludeInvoiceIds);
    }
    return this.httpClient.get<BulkCreditNotePreviewResult>(`${this.apiUrl}/preview`, { params });
  }

  startJob(
    maxInvoices: number,
    performedBy: number,
    invoiceIds: number[],
    reason: string
  ): Observable<BulkCreditNoteStartResult> {
    return this.httpClient.post<BulkCreditNoteStartResult>(`${this.apiUrl}/start`, {
      maxInvoices,
      performedBy,
      invoiceIds,
      reason,
    });
  }

  cancelJob(runId: number): Observable<{ cancelled: boolean }> {
    return this.httpClient.post<{ cancelled: boolean }>(`${this.apiUrl}/cancel/${runId}`, {});
  }

  getRun(runId: number): Observable<BulkCreditNoteRun> {
    return this.httpClient.get<BulkCreditNoteRun>(`${this.apiUrl}/runs/${runId}`);
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
