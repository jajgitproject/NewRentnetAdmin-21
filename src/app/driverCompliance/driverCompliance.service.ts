// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { DriverCompliancePage } from './driverCompliance.model';

@Injectable()
export class DriverComplianceService {
  private readonly API_URL: string;

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'driverCompliance';
  }

  getPage(driverId: number): Observable<DriverCompliancePage> {
    return this.httpClient.get<DriverCompliancePage>(`${this.API_URL}/${driverId}`);
  }

  saveBulk(driverId: number, rows: any[]): Observable<any> {
    const payload = {
      driverID: driverId,
      userID: this.generalService.getUserID(),
      rows: rows.map((row) => ({
        action: row.action,
        document: this.mapDocumentPayload(row.document, driverId),
      })),
    };
    return this.httpClient.post(`${this.API_URL}/save`, payload);
  }

  private mapDocumentPayload(doc: any, driverId: number): any {
    const payload = { ...doc };
    payload.driverID = driverId;
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
    } else if (!payload.documentImageNonAvailabilityReason?.trim()) {
      payload.documentImageNonAvailabilityReason = null;
    }
    return payload;
  }
}
