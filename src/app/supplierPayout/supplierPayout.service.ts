// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  SupplierPayoutDutySlipSearchCriteria,
  SupplierPayoutDutySlipRow,
  SupplierPayoutGroupSummary,
  SupplierPayoutHistoryRow,
  SupplierPayoutHistorySearchCriteria,
  SupplierPayoutMarkPaidRequest,
  SupplierPayoutReportCriteria,
  SupplierPayoutPreviousGroupContext,
  SupplierPayoutMismatchDutyRow,
} from './supplierPayout.model';

@Injectable()
export class SupplierPayoutService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'supplierPayout';
  }

  searchDutySlips(criteria: SupplierPayoutDutySlipSearchCriteria): Observable<SupplierPayoutDutySlipRow[]> {
    return this.httpClient.post<SupplierPayoutDutySlipRow[]>(`${this.API_URL}/dutySlips/search`, criteria);
  }

  markPaid(performedBy: number, request: SupplierPayoutMarkPaidRequest): Observable<SupplierPayoutGroupSummary> {
    return this.httpClient.post<SupplierPayoutGroupSummary>(`${this.API_URL}/markPaid/${performedBy}`, request);
  }

  getPreviousGroupContext(supplierId: number): Observable<SupplierPayoutPreviousGroupContext> {
    return this.httpClient.get<SupplierPayoutPreviousGroupContext>(`${this.API_URL}/supplier/${supplierId}/previousGroupContext`);
  }

  getMismatchDuties(supplierId: number): Observable<SupplierPayoutMismatchDutyRow[]> {
    return this.httpClient.get<SupplierPayoutMismatchDutyRow[]>(`${this.API_URL}/supplier/${supplierId}/mismatchDuties`);
  }

  getGroup(groupId: number): Observable<SupplierPayoutGroupSummary> {
    return this.httpClient.get<SupplierPayoutGroupSummary>(`${this.API_URL}/group/${groupId}`);
  }

  searchHistory(criteria: SupplierPayoutHistorySearchCriteria): Observable<SupplierPayoutHistoryRow[]> {
    return this.httpClient.post<SupplierPayoutHistoryRow[]>(`${this.API_URL}/history/search`, criteria);
  }

  exportGroup(groupId: number): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/group/${groupId}/export`, { responseType: 'blob' });
  }

  printGroup(groupId: number): Observable<string> {
    return this.httpClient.get(`${this.API_URL}/group/${groupId}/print`, { responseType: 'text' });
  }

  downloadReport(criteria: SupplierPayoutReportCriteria): Observable<Blob> {
    return this.httpClient.post(`${this.API_URL}/report/download`, criteria, { responseType: 'blob' });
  }
}
