// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';

@Injectable()
export class GeneralBillDetailsService {
  private API_URL: string = '';
  private GENERAL_BILL_API_URL: string = '';
  Result: string = 'Failure';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.API_URL = generalService.BaseURL + 'generalBillMain';
    this.GENERAL_BILL_API_URL = generalService.BaseURL + 'generalBill';
  }

  printGeneralBillInfo(invoiceID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + "/"+'GetGeneralBillByInvoiceID'+ "/" + invoiceID);
  }

  getInvoiceBillToShipToConfigId(
    invoiceID: number,
    customerName?: string
  ): Observable<number | null> {
    const customerParam =
      customerName && String(customerName).trim()
        ? encodeURIComponent(String(customerName).trim())
        : 'null';

    return this.httpClient
      .get<any[]>(
        `${this.GENERAL_BILL_API_URL}/GetAllGeneralBillMain/${customerParam}/null/null/null/null/null/true/0/InvoiceID/Descending`
      )
      .pipe(
        map((list) => {
          const match = (list || []).find(
            (item) => Number(item?.invoiceID) === Number(invoiceID)
          );
          const shipToId = Number(match?.customerConfigurationBillToShipToID || 0);
          return shipToId > 0 ? shipToId : null;
        })
      );
  }
}

