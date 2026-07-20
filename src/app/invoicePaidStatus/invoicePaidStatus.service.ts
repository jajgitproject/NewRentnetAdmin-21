// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  InvoicePaidStatusHistoryRow,
  InvoicePaidStatusMarkRequest,
  InvoicePaidStatusMarkResult,
  InvoicePaidStatusSearchResult,
  InvoicePaidStatusSearchCriteria,
} from './invoicePaidStatus.model';

@Injectable()
export class InvoicePaidStatusService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'invoicePaidStatus';
  }

  search(criteria: InvoicePaidStatusSearchCriteria): Observable<InvoicePaidStatusSearchResult> {
    return this.httpClient.post<InvoicePaidStatusSearchResult>(`${this.API_URL}/search`, criteria);
  }

  getInvoiceHistory(invoiceId: number): Observable<InvoicePaidStatusHistoryRow[]> {
    return this.httpClient.get<InvoicePaidStatusHistoryRow[]>(`${this.API_URL}/history/${invoiceId}`);
  }

  markPaidStatus(
    performedBy: number,
    request: InvoicePaidStatusMarkRequest
  ): Observable<InvoicePaidStatusMarkResult> {
    return this.httpClient.post<InvoicePaidStatusMarkResult>(
      `${this.API_URL}/markPaidStatus/${performedBy}`,
      request
    );
  }
}
