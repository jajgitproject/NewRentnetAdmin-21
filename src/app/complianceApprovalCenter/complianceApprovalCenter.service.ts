// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { ComplianceApprovalCenterResponse } from './complianceApprovalCenter.model';

@Injectable()
export class ComplianceApprovalCenterService {
  private readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private generalService: GeneralService) {
    this.apiUrl = this.generalService.BaseURL + 'complianceApprovalCenter';
  }

  getData(
    searchText: string,
    resourceType: string,
    documentID: string,
    verificationStatus: string,
    documentNumber: string,
    metricFilter: string,
    pageNumber: number,
    orderByColumn: string,
    order: string
  ): Observable<ComplianceApprovalCenterResponse> {
    const segments = [
      this.nullIfEmpty(searchText),
      this.nullIfEmpty(resourceType),
      this.nullIfEmpty(documentID),
      this.nullIfEmpty(verificationStatus),
      this.nullIfEmpty(documentNumber),
      this.nullIfEmpty(metricFilter),
      pageNumber,
      orderByColumn || 'DocumentRecordID',
      order || 'Ascending',
    ];
    const url =
      this.apiUrl + '/' + segments.map((segment) => encodeURIComponent(String(segment))).join('/');
    return this.httpClient.get<any>(url).pipe(map((data) => new ComplianceApprovalCenterResponse(data)));
  }

  private nullIfEmpty(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return 'null';
    }
    return String(value);
  }
}
