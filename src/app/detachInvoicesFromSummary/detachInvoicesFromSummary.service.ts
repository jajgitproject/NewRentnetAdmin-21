// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class DetachInvoicesFromSummaryService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'invoiceSummary';
  }

  searchInvoices(
    summaryID: number,
    invoiceDateFrom: string,
    invoiceDateTo: string,
    invoiceNumberWithPrefix: string,
    pageNumber: number
  ): Observable<any> {
    if (!invoiceDateFrom) {
      invoiceDateFrom = 'null';
    }
    if (!invoiceDateTo) {
      invoiceDateTo = 'null';
    }

    let params = new HttpParams();
    if (invoiceNumberWithPrefix) {
      params = params.set('invoiceNumberWithPrefix', invoiceNumberWithPrefix);
    }

    const url =
      this.API_URL +
      '/AttachedInvoices/' +
      summaryID +
      '/' +
      invoiceDateFrom +
      '/' +
      invoiceDateTo +
      '/' +
      pageNumber +
      '/InvoiceNumberWithPrefix/Descending';

    return this.httpClient.get(url, { params });
  }

  detachInvoices(summaryID: number, invoiceIDs: number[]): Observable<any> {
    return this.httpClient.post(this.API_URL + '/DetachInvoices', {
      summaryID: summaryID,
      userID: this.generalService.getUserID(),
      invoiceIDs: invoiceIDs
    });
  }
}
