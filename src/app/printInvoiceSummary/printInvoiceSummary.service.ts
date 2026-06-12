// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class PrintInvoiceSummaryService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'invoiceSummary';
  }

  getPrintData(summaryID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/Print/' + summaryID);
  }
}
