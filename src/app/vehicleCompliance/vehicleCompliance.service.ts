// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  VehicleCompliancePage,
} from './vehicleCompliance.model';

@Injectable()
export class VehicleComplianceService {
  private readonly API_URL: string;

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'vehicleCompliance';
  }

  getPage(inventoryId: number): Observable<VehicleCompliancePage> {
    return this.httpClient.get<VehicleCompliancePage>(`${this.API_URL}/${inventoryId}`);
  }

  saveBulk(inventoryId: number, rows: any[]): Observable<any> {
    const payload = {
      inventoryID: inventoryId,
      userID: this.generalService.getUserID(),
      rows: rows.map((row) => ({
        action: row.action,
        document: this.mapDocumentPayload(row.document, inventoryId),
      })),
    };
    return this.httpClient.post(`${this.API_URL}/save`, payload);
  }

  private mapDocumentPayload(doc: any, inventoryId: number): any {
    const payload = { ...doc };
    payload.inventoryID = inventoryId;
    payload.userID = this.generalService.getUserID();
    payload.documentExpiryString = this.generalService.getTimeApplicable(payload.documentExpiry);
    if (payload.documentStartDate) {
      payload.documentStartDateString = this.generalService.getTimeApplicable(payload.documentStartDate);
    } else {
      payload.documentStartDate = null;
      payload.documentStartDateString = null;
    }
    if (!payload.documentNumber?.trim()) {
      payload.documentNumber = null;
    }
    if (!payload.documentIssuingAuthority?.trim()) {
      payload.documentIssuingAuthority = null;
    }
    if (payload.documentImage?.trim()) {
      payload.documentImageNonAvailabilityReason = null;
    } else     if (!payload.documentImageNonAvailabilityReason?.trim()) {
      payload.documentImageNonAvailabilityReason = null;
    }
    return payload;
  }
}
