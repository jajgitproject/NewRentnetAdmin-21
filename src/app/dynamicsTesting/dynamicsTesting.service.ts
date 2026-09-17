// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class DynamicsTestingService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'DynamicsAPI';
  }

  sendInvoiceToDynamics(invoiceId: number): Observable<HttpResponse<any>> {
    return this.httpClient.get<any>(
      `${this.API_URL}/SendInvoiceToDynamicsAPI/${invoiceId}`,
      { observe: 'response' }
    );
  }

  sendEInvoiceToDynamics(invoiceId: number): Observable<HttpResponse<any>> {
    return this.httpClient.get<any>(
      `${this.API_URL}/SendEInvoiceToDynamicsAPI/${invoiceId}`,
      { observe: 'response' }
    );
  }
}
