// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GeneralService } from '../general/general.service';
import {
  FuelEntryDetailDto,
  FuelEntryLookupDto,
  FuelEntrySaveRequest,
  FuelEntrySearchCriteria,
  FuelEntrySearchRow,
  FuelEntryVehicleContextDto,
  FuelEntryDocumentDto,
  FuelDriverOption,
  FuelEntryCalculationPreviewRequest,
  FuelEntryCalculationPreviewDto,
  FuelEntryVerificationSearchCriteria,
  FuelEntryVerificationPagedResult,
  FuelEntryVerificationActionRequest,
  FuelEntryVerificationActionResult,
  FuelEntryStatusHistoryItem,
  FuelEntryMisSearchCriteria,
  FuelEntryMisPagedResult,
} from './fuelEntry.model';

@Injectable()
export class FuelEntryService {
  private apiBase = '';

  constructor(private httpClient: HttpClient, private generalService: GeneralService) {
    this.apiBase = this.generalService.BaseURL + 'fuelEntry';
  }

  getLookups(): Observable<FuelEntryLookupDto> {
    return this.httpClient.get<FuelEntryLookupDto>(`${this.apiBase}/lookups`);
  }

  getDrivers(prefix: string = ''): Observable<FuelDriverOption[]> {
    let params = '';
    if (prefix && prefix.trim()) {
      params = '?prefix=' + encodeURIComponent(prefix.trim());
    }
    return this.httpClient.get<FuelDriverOption[]>(`${this.apiBase}/drivers${params}`);
  }

  getVehicleContext(registrationNumber: string): Observable<FuelEntryVehicleContextDto> {
    const encoded = encodeURIComponent(registrationNumber.trim());
    return this.httpClient.get<FuelEntryVehicleContextDto>(`${this.apiBase}/vehicle/${encoded}`);
  }

  getCalculationPreview(request: FuelEntryCalculationPreviewRequest): Observable<FuelEntryCalculationPreviewDto> {
    return this.httpClient.post<FuelEntryCalculationPreviewDto>(`${this.apiBase}/calculations/preview`, request);
  }

  search(criteria: FuelEntrySearchCriteria): Observable<FuelEntrySearchRow[]> {
    return this.httpClient.post<FuelEntrySearchRow[]>(`${this.apiBase}/search`, criteria);
  }

  getById(id: number): Observable<FuelEntryDetailDto> {
    return this.httpClient.get<FuelEntryDetailDto>(`${this.apiBase}/${id}`);
  }

  create(performedBy: number, request: FuelEntrySaveRequest): Observable<FuelEntryDetailDto> {
    return this.httpClient.post<FuelEntryDetailDto>(`${this.apiBase}/${performedBy}`, request);
  }

  update(id: number, performedBy: number, request: FuelEntrySaveRequest): Observable<FuelEntryDetailDto> {
    return this.httpClient.put<FuelEntryDetailDto>(`${this.apiBase}/${id}/${performedBy}`, request);
  }

  delete(id: number, performedBy: number): Observable<any> {
    return this.httpClient.delete(`${this.apiBase}/${id}/${performedBy}`);
  }

  uploadDocument(
    fuelEntryId: number,
    documentType: string,
    performedBy: number,
    file: File
  ): Observable<FuelEntryDocumentDto> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post<FuelEntryDocumentDto>(
      `${this.apiBase}/${fuelEntryId}/documents/${documentType}/${performedBy}`,
      formData
    );
  }

  deleteDocument(fuelEntryId: number, documentId: number, performedBy: number): Observable<any> {
    return this.httpClient.delete(`${this.apiBase}/${fuelEntryId}/documents/${documentId}/${performedBy}`);
  }

  getDocumentFileUrl(fuelEntryId: number, documentId: number): string {
    return `${this.apiBase}/${fuelEntryId}/documents/${documentId}/file`;
  }

  downloadDocument(fuelEntryId: number, documentId: number): Observable<Blob> {
    return this.httpClient.get(this.getDocumentFileUrl(fuelEntryId, documentId), { responseType: 'blob' });
  }

  verificationSearch(criteria: FuelEntryVerificationSearchCriteria): Observable<FuelEntryVerificationPagedResult> {
    return this.httpClient.post<FuelEntryVerificationPagedResult>(`${this.apiBase}/verification/search`, criteria);
  }

  verifyEntries(performedBy: number, request: FuelEntryVerificationActionRequest): Observable<FuelEntryVerificationActionResult> {
    return this.httpClient.post<FuelEntryVerificationActionResult>(
      `${this.apiBase}/verification/verify/${performedBy}`,
      request
    );
  }

  holdEntries(performedBy: number, request: FuelEntryVerificationActionRequest): Observable<FuelEntryVerificationActionResult> {
    return this.httpClient.post<FuelEntryVerificationActionResult>(
      `${this.apiBase}/verification/hold/${performedBy}`,
      request
    );
  }

  rejectEntries(performedBy: number, request: FuelEntryVerificationActionRequest): Observable<FuelEntryVerificationActionResult> {
    return this.httpClient.post<FuelEntryVerificationActionResult>(
      `${this.apiBase}/verification/reject/${performedBy}`,
      request
    );
  }

  getStatusHistory(fuelEntryId: number): Observable<FuelEntryStatusHistoryItem[]> {
    return this.httpClient.get<FuelEntryStatusHistoryItem[]>(`${this.apiBase}/${fuelEntryId}/history`);
  }

  misSearch(criteria: FuelEntryMisSearchCriteria): Observable<FuelEntryMisPagedResult> {
    return this.httpClient.post<FuelEntryMisPagedResult>(
      this.generalService.BaseURL + 'fuelEntryMIS/search',
      criteria
    );
  }
}
