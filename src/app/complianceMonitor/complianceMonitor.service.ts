// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import {
  ComplianceMonitorLocationOption,
  ComplianceMonitorResponse,
} from './complianceMonitor.model';

@Injectable()
export class ComplianceMonitorService {
  private readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private generalService: GeneralService) {
    this.apiUrl = this.generalService.BaseURL + 'complianceMonitor';
  }

  getData(
    searchText: string,
    resourceType: string,
    documentID: string,
    urgency: string,
    metricFilter: string,
    branchID: number | null,
    locationID: number | null,
    pageNumber: number
  ): Observable<ComplianceMonitorResponse> {
    const segments = [
      this.nullIfEmpty(searchText),
      this.nullIfEmpty(resourceType),
      this.nullIfEmpty(documentID),
      this.nullIfEmpty(urgency),
      this.nullIfEmpty(metricFilter),
      branchID && branchID > 0 ? String(branchID) : 'null',
      locationID && locationID > 0 ? String(locationID) : 'null',
      pageNumber,
      'DaysRemaining',
      'Ascending',
    ];
    const url = this.apiUrl + '/' + segments.map((s) => encodeURIComponent(String(s))).join('/');
    return this.httpClient.get<any>(url).pipe(map((data) => new ComplianceMonitorResponse(data)));
  }

  getLocationsByBranch(branchId: number): Observable<ComplianceMonitorLocationOption[]> {
    const id = branchId && branchId > 0 ? branchId : 0;
    return this.httpClient.get<any[]>(`${this.apiUrl}/locations/${id}`).pipe(
      map((list) => (list || []).map((item) => new ComplianceMonitorLocationOption(item)))
    );
  }

  private nullIfEmpty(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return 'null';
    }
    return String(value);
  }
}
