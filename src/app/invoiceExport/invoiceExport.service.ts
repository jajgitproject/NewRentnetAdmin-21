// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { InvoiceExportRow } from './invoiceExport.model';

@Injectable()
export class InvoiceExportService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'invoiceExport';
  }

  getAllInvoices(fromDate: string, toDate: string): Observable<InvoiceExportRow[]> {
    return this.httpClient.get<InvoiceExportRow[]>(`${this.API_URL}/all/${fromDate}/${toDate}`);
  }

  getDuplicateInvoices(fromDate: string, toDate: string): Observable<InvoiceExportRow[]> {
    return this.httpClient.get<InvoiceExportRow[]>(`${this.API_URL}/duplicates/${fromDate}/${toDate}`);
  }
}
