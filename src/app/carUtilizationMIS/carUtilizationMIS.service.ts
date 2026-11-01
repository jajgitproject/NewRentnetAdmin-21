// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import {
  CarUtilizationReportPagedResult,
  CarUtilizationReportSearchCriteria
} from './carUtilizationMIS.model';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

@Injectable()
export class CarUtilizationMISService {
  private readonly reportApiUrl: string;

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.reportApiUrl = generalService.BaseURL + 'carUtilizationReport';
  }

  searchReport(criteria: CarUtilizationReportSearchCriteria): Observable<CarUtilizationReportPagedResult> {
    return this.httpClient.post<CarUtilizationReportPagedResult>(
      `${this.reportApiUrl}/search`,
      criteria
    );
  }

  private buildExportPayload(criteria: CarUtilizationReportSearchCriteria) {
    return {
      userID: this.generalService.getUserID(),
      pickupDateFrom: criteria.pickupDateFrom || null,
      pickupDateTo: criteria.pickupDateTo || null,
      carNumbers: criteria.carNumbers || '',
      customerName: criteria.customerName || '',
      dutySlipIds: criteria.dutySlipIds || '',
      reservationIds: criteria.reservationIds || '',
      pageNumber: 0
    };
  }

  startExportJob(criteria: CarUtilizationReportSearchCriteria): Observable<any> {
    return this.httpClient.post(
      `${this.reportApiUrl}/ExportCsv/StartJob`,
      this.buildExportPayload(criteria)
    );
  }

  getExportJobStatus(jobId: string): Observable<any> {
    return this.httpClient.get(`${this.reportApiUrl}/ExportCsv/JobStatus/${jobId}`);
  }

  downloadExportJob(jobId: string): Observable<Blob> {
    return this.httpClient.get(`${this.reportApiUrl}/ExportCsv/Download/${jobId}`, {
      responseType: 'blob'
    });
  }

  cancelExportJob(jobId: string): Observable<any> {
    return this.httpClient.post(`${this.reportApiUrl}/ExportCsv/Cancel/${jobId}`, {}, {
      params: { userId: String(this.generalService.getUserID() || 0) }
    });
  }

  pollExportJob(jobId: string): Observable<any> {
    return pollExportJob(this.httpClient, `${this.reportApiUrl}/ExportCsv/JobStatus/${jobId}`);
  }

  isExportJobRunning(status: any): boolean {
    return isExportJobRunning(status);
  }

  isExportJobReady(status: any): boolean {
    return isExportJobReady(status);
  }
}
