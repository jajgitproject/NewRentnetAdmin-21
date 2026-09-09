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

  getEvents(filters: HealthFilters, page: number = 1, from?: string, to?: string): Observable<any> {
    const params = new URLSearchParams({
      aggregator: filters.vendor || '',
      status: filters.status || '',
      source: filters.source || '',
      driverEndpoint: filters.driverEndpoint || '',
      rentnetReservationID: filters.rentnetReservationID || '',
      customerIntegrationSearch: filters.customerIntegrationSearch || '',
      from: from || this.toQueryDate(filters.fromDate),
      to: to || this.toQueryDate(filters.toDate),
      page: String(page)
    });
    return this.http.get<any>(`${this.baseUrl}events?${params}`);
  }

  private toQueryDate(value: Date | string | null | undefined): string {
    if (!value) {
      return '';
    }
    if (value instanceof Date && !isNaN(value.getTime())) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return String(value);
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
