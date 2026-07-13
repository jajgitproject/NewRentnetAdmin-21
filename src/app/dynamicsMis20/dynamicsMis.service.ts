// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

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

  private toNull(value: any) {
    if (value === undefined || value === null) {
      return null;
    }
    const text = String(value).trim();
    if (text === '' || text.toLowerCase() === 'null') {
      return null;
    }
    return value;
  }

  private buildExportCriteria(
    fromDate: string,
    toDate: string,
    customerName: string,
    invoiceNumberWithPrefix: string,
    branchName: string,
    orderByColumn = 'InvoiceID',
    order = 'Ascending'
  ) {
    return {
      FromDate: this.toNull(fromDate),
      ToDate: this.toNull(toDate),
      CustomerName: this.toNull(customerName),
      InvoiceNumberWithPrefix: this.toNull(invoiceNumberWithPrefix),
      BranchName: this.toNull(branchName),
      OrderByColumn: orderByColumn,
      Order: order
    };
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

  startExportJob(
    fromDate: string,
    toDate: string,
    customerName: string,
    invoiceNumberWithPrefix: string,
    branchName: string,
    orderByColumn = 'InvoiceID',
    order = 'Ascending'
  ): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}/ExportCsv/StartJob`,
      this.buildExportCriteria(fromDate, toDate, customerName, invoiceNumberWithPrefix, branchName, orderByColumn, order)
    );
  }

  getExportJobStatus(jobId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/ExportCsv/JobStatus/${jobId}`);
  }

  downloadExportJob(jobId: string): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/ExportCsv/Download/${jobId}`, { responseType: 'blob' });
  }

  pollExportJob(jobId: string): Observable<any> {
    return pollExportJob(this.httpClient, `${this.API_URL}/ExportCsv/JobStatus/${jobId}`);
  }

  isExportJobRunning(status: any): boolean {
    return isExportJobRunning(status);
  }

  isExportJobReady(status: any): boolean {
    return isExportJobReady(status);
  }

  /** @deprecated Use startExportJob */
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
