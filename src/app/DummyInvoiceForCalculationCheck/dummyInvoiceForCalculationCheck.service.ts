// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';


@Injectable()
export class DummyInvoiceForCalculationCheckService {
  private API_URL: string = '';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.API_URL = generalService.BaseURL + 'invoicecalculation';
  }

  getDummyInvoice(dutySlipID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/getDummyInvoice/' + dutySlipID);
  }
}
