// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';

export interface Mis20PageResponse {
  totalRecords: number;
  rows: Record<string, unknown>[];
}

@Injectable()
export class DynamicsMis20Service {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'DynamicsMIS20';
  }

  private toRouteParam(value: string): string {
    const normalized = value === '' ? 'null' : value;
    return encodeURIComponent(normalized);
  }

  getTableData(
    fromDate: string,
    toDate: string,
    customerName: string,
    invoiceNumberWithPrefix: string,
    branchName: string,
    pageNumber: number,
    orderByColumn: string,
    order: string
  ): Observable<Mis20PageResponse> {
    return this.httpClient.get<Mis20PageResponse>(
      `${this.API_URL}/${this.toRouteParam(fromDate)}/${this.toRouteParam(toDate)}/${this.toRouteParam(customerName)}/${this.toRouteParam(invoiceNumberWithPrefix)}/${this.toRouteParam(branchName)}/${pageNumber}/${encodeURIComponent(orderByColumn)}/${encodeURIComponent(order)}`
    );
  }

  downloadCsv(
    fromDate: string,
    toDate: string,
    customerName: string,
    invoiceNumberWithPrefix: string,
    branchName: string
  ): Observable<Blob> {
    return this.httpClient.get(
      `${this.API_URL}/Export/${this.toRouteParam(fromDate)}/${this.toRouteParam(toDate)}/${this.toRouteParam(customerName)}/${this.toRouteParam(invoiceNumberWithPrefix)}/${this.toRouteParam(branchName)}/-1/InvoiceID/Ascending`,
      { responseType: 'blob' }
    );
  }
}
