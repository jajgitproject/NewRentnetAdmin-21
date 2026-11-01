// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { CreditNoteHistory } from './creditnotehistory.model';

@Injectable()
export class CreditNoteHistoryService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "invoiceCreditNoteHistory";
  }

  /** Preferred: history for one credit note. */
  getCreditNoteHistoryByCreditNoteId(invoiceCreditNoteID: number): Observable<CreditNoteHistory[]> {
    return this.httpClient.get<CreditNoteHistory[]>(
      `${this.API_URL}/ByInvoiceCreditNoteID/${invoiceCreditNoteID}`
    );
  }

  /** Fallback: all credit-note history under an invoice (Invoice Home). */
  getCreditNoteHistory(invoiceID: number): Observable<CreditNoteHistory[]> {
    return this.httpClient.get<CreditNoteHistory[]>(
      `${this.API_URL}/ForInvoiceCreditNoteHistory/${invoiceID}`
    );
  }

  getCreditNoteHistoryByLifeCycleStatus(invoiceID: number, status: string): Observable<CreditNoteHistory[]> {
    return this.httpClient.get<CreditNoteHistory[]>(
      `${this.API_URL}/ForInvoiceCreditNoteHistory/${invoiceID}?status=${status}`
    );
  }

  getLifeCycleStatuses(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.API_URL}/LifeCycleStatuses`);
  }
}
