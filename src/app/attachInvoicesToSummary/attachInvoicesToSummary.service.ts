// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class AttachInvoicesToSummaryService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'invoiceSummary';
  }

  searchInvoices(
    customerID: number,
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
    if (!invoiceNumberWithPrefix) {
      invoiceNumberWithPrefix = 'null';
    } else {
      invoiceNumberWithPrefix = invoiceNumberWithPrefix.replace(/\//g, '-');
    }
    return this.httpClient.get(
      this.API_URL +
        '/UnattachedInvoices/' +
        customerID +
        '/' +
        invoiceDateFrom +
        '/' +
        invoiceDateTo +
        '/' +
        invoiceNumberWithPrefix +
        '/' +
        pageNumber +
        '/InvoiceDate/Descending'
    );
  }

  attachInvoices(summaryID: number, invoiceIDs: number[]): Observable<any> {
    return this.httpClient.post(this.API_URL + '/AttachInvoices', {
      summaryID: summaryID,
      userID: this.generalService.getUserID(),
      invoiceIDs: invoiceIDs
    });
  }
}
