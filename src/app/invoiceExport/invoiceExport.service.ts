// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  InvoiceExportRow,
  GeneralLineItemInvoiceGapRow,
  GeneralLinkedDutyGapRow,
  VerifiedGfbNotCalculatedCounts,
  VerifiedGfbNotCalculatedReport,
} from './invoiceExport.model';

@Injectable()
export class InvoiceExportService {
  private API_URL = '';
  private BILLING_DIAGNOSTICS_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'invoiceExport';
    this.BILLING_DIAGNOSTICS_URL = generalService.BaseURL + 'billingDiagnostics';
  }

  getAllInvoices(fromDate: string, toDate: string): Observable<InvoiceExportRow[]> {
    return this.httpClient.get<InvoiceExportRow[]>(`${this.API_URL}/all/${fromDate}/${toDate}`);
  }

  getDuplicateInvoices(fromDate: string, toDate: string): Observable<InvoiceExportRow[]> {
    return this.httpClient.get<InvoiceExportRow[]>(`${this.API_URL}/duplicates/${fromDate}/${toDate}`);
  }

  getGeneralLineItemInvoiceGaps(
    fromDate: string,
    toDate: string
  ): Observable<GeneralLineItemInvoiceGapRow[]> {
    const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate);
    return this.httpClient.get<GeneralLineItemInvoiceGapRow[]>(
      `${this.API_URL}/generalLineItemInvoiceGap`,
      { params }
    );
  }

  getGeneralLinkedDutyGaps(
    fromDate: string,
    toDate: string
  ): Observable<GeneralLinkedDutyGapRow[]> {
    const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate);
    return this.httpClient.get<GeneralLinkedDutyGapRow[]>(
      `${this.API_URL}/generalLinkedDutyGap`,
      { params }
    );
  }

  getVerifiedGfbNotCalculatedCounts(
    dutyFromDate: string,
    dutyToDate: string
  ): Observable<VerifiedGfbNotCalculatedCounts> {
    const params = new HttpParams()
      .set('dutyFromDate', dutyFromDate)
      .set('dutyToDate', dutyToDate)
      .set('calcStatus', 'All');
    return this.httpClient.get<VerifiedGfbNotCalculatedCounts>(
      `${this.BILLING_DIAGNOSTICS_URL}/verifiedGfbNotCalculated/counts`,
      { params }
    );
  }

  getVerifiedGfbNotCalculatedReport(
    dutyFromDate: string,
    dutyToDate: string,
    page: number,
    pageSize: number
  ): Observable<VerifiedGfbNotCalculatedReport> {
    const params = new HttpParams()
      .set('dutyFromDate', dutyFromDate)
      .set('dutyToDate', dutyToDate)
      .set('calcStatus', 'All')
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    return this.httpClient.get<VerifiedGfbNotCalculatedReport>(
      `${this.BILLING_DIAGNOSTICS_URL}/verifiedGfbNotCalculated`,
      { params }
    );
  }
}
