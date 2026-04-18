// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { InvoiceBillingHistory } from './invoiceBillingHistory.model';
@Injectable()
export class InvoiceBillingHistoryService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + "invoiceBillingHistory";
  }

 getInvoiceBilling(invoiceID: number): Observable<InvoiceBillingHistory[]> {
      return this.httpClient.get<InvoiceBillingHistory[]>(this.API_URL + '/'+ invoiceID);
  }
}
