// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { AppBillingReceiptRow, AppBillingReceiptSearchFilter } from './appBillingReceipt.model';

@Injectable()
export class AppBillingReceiptService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, private generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'appBillingReceipt';
  }

  search(filter: AppBillingReceiptSearchFilter): Observable<AppBillingReceiptRow[]> {
    return this.httpClient.put<AppBillingReceiptRow[]>(this.API_URL + '/search', filter);
  }

  downloadPdf(appBillingReceiptID: number): Observable<Blob> {
    return this.httpClient.get(this.API_URL + '/pdf/' + appBillingReceiptID, {
      responseType: 'blob',
    });
  }
}
