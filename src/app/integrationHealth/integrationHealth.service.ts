// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { FailureRow, HealthFilters } from './integrationHealth.model';

@Injectable()
export class IntegrationHealthService {
  private baseUrl: string;

  constructor(private http: HttpClient, private generalService: GeneralService) {
    this.baseUrl = generalService.BaseURL + 'integrationHealth/';
  }

  getSummary(from: string, to: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}summary?from=${from}&to=${to}`);
  }

  getEvents(filters: HealthFilters, page: number = 1): Observable<any> {
    const params = new URLSearchParams({
      aggregator: filters.vendor || '',
      status: filters.status || '',
      source: filters.source || '',
      driverEndpoint: filters.driverEndpoint || '',
      rentnetReservationID: filters.rentnetReservationID || '',
      from: filters.fromDate || '',
      to: filters.toDate || '',
      page: String(page)
    });
    return this.http.get<any>(`${this.baseUrl}events?${params}`);
  }

  getRecentFailures(): Observable<FailureRow[]> {
    return this.http.get<FailureRow[]>(`${this.baseUrl}failures/recent`);
  }

  resend(payload: any): Observable<any> {
    return this.http.post<any>(this.generalService.BaseURL + 'resendIntegrationLog', payload);
  }

  getCustomersForAutocomplete(prefix: string): Observable<any[]> {
    return this.generalService.GetCustomerDropDownForControlPanel(prefix);
  }
}
