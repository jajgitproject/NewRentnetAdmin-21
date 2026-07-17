// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class FinanceDashboardService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'financeDashboard';
  }

  private buildFilterParams(filters: any): HttpParams {
    let params = new HttpParams()
      .set('filterDate', filters.filterDateTo || filters.filterDate)
      .set('filterDateFrom', filters.filterDateFrom || filters.filterDate)
      .set('filterDateTo', filters.filterDateTo || filters.filterDate)
      .set('dataFromLaunchDate', filters.dataFromLaunchDate ? 'true' : 'false')
      .set('employeeID', String(filters.employeeID));
    if (filters.seriesPrefix) params = params.set('seriesPrefix', filters.seriesPrefix);
    if (filters.invoiceType) params = params.set('invoiceType', filters.invoiceType);
    if (filters.seriesJumpActiveOnly) params = params.set('seriesJumpActiveOnly', 'true');
    return params;
  }

  getSummary(filters: any): Observable<any> {
    return this.httpClient.get<any>(this.API_URL + '/summary', { params: this.buildFilterParams(filters) });
  }

  getDashboard(filters: any): Observable<any> {
    return this.httpClient.get<any>(this.API_URL + '/dashboard', { params: this.buildFilterParams(filters) });
  }

  getSeries(filters: any, documentType: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/series', {
      params: this.buildFilterParams(filters).set('documentType', documentType),
    });
  }

  getDrillDown(filters: any, documentType: string, validationCode: string, seriesName: string | null, page = 1, pageSize = 25): Observable<any> {
    let params = this.buildFilterParams(filters)
      .set('documentType', documentType)
      .set('validationCode', validationCode)
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (seriesName) params = params.set('seriesName', seriesName);
    return this.httpClient.get<any>(this.API_URL + '/drilldown', { params });
  }

  getFilterOptions(filters: any): Observable<any> {
    return this.httpClient.get<any>(this.API_URL + '/filterOptions', {
      params: this.buildFilterParams(filters),
    });
  }
}
