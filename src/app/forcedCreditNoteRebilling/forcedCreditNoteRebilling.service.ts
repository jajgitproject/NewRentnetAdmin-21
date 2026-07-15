// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';

@Injectable()
export class ForcedCreditNoteRebillingService {
  private API_URL: string = '';
  private ACTION_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    // Search / list endpoint for the Forced Credit Note Rebilling page.
    this.API_URL = generalService.BaseURL + 'forcedCreditNoteRebilling';
    // Existing action endpoint (must NOT be modified).
    this.ACTION_URL = generalService.BaseURL + 'creditNoteApproval';
  }

  /**
   * Fetches the list of credit notes that are eligible for forced rebilling.
   * The backend is expected to apply the business rules:
   *   InvoiceCreditNote.CreditNoteAmount = Invoice.InvoiceTotalAmountAfterGST
   *   AND InvoiceCreditNote.RequiresReBilling = 0
   *   AND InvoiceCreditNote.InvoiceID = Invoice.InvoiceID
   * plus the optional search filters below.
   */
  getTableData(
    searchCustomerID: any,
    searchCreditNoteDateFrom: string,
    searchCreditNoteDateTo: string,
    searchCreditNoteNumberWithPrefix: string,
    searchInvoiceNumberWithPrefix: string,
    pageNumber: number
  ): Observable<any> {
    if (searchCustomerID === '' || searchCustomerID === null || searchCustomerID === undefined) {
      searchCustomerID = 'null';
    }
    if (searchCreditNoteDateFrom === '' || searchCreditNoteDateFrom === null || searchCreditNoteDateFrom === undefined) {
      searchCreditNoteDateFrom = 'null';
    }
    if (searchCreditNoteDateTo === '' || searchCreditNoteDateTo === null || searchCreditNoteDateTo === undefined) {
      searchCreditNoteDateTo = 'null';
    }
    if (
      searchCreditNoteNumberWithPrefix === '' ||
      searchCreditNoteNumberWithPrefix === null ||
      searchCreditNoteNumberWithPrefix === undefined
    ) {
      searchCreditNoteNumberWithPrefix = 'null';
    } else {
      // Slashes break the URL path, so send them as '-' (server converts back to '/').
      searchCreditNoteNumberWithPrefix = searchCreditNoteNumberWithPrefix.toString().replace(/\//g, '-');
    }
    if (
      searchInvoiceNumberWithPrefix === '' ||
      searchInvoiceNumberWithPrefix === null ||
      searchInvoiceNumberWithPrefix === undefined
    ) {
      searchInvoiceNumberWithPrefix = 'null';
    } else {
      // Slashes break the URL path, so send them as '-' (server converts back to '/').
      searchInvoiceNumberWithPrefix = searchInvoiceNumberWithPrefix.toString().replace(/\//g, '-');
    }

    return this.httpClient.get(
      this.API_URL +
        '/' +
        searchCustomerID +
        '/' +
        searchCreditNoteDateFrom +
        '/' +
        searchCreditNoteDateTo +
        '/' +
        searchCreditNoteNumberWithPrefix +
        '/' +
        searchInvoiceNumberWithPrefix +
        '/' +
        pageNumber +
        '/InvoiceCreditNoteID/Descending'
    );
  }

  /**
   * Triggers forced rebilling for a single credit note.
   * The API returns a plain string (Success / Failure), so responseType is text.
   */
  forcedRebilling(invoiceCreditNoteID: number): Observable<string> {
    return this.httpClient.get(this.ACTION_URL + '/GetApprovedCreditNoteandForcedRebilling/' + invoiceCreditNoteID, {
      responseType: 'text'
    });
  }
}
