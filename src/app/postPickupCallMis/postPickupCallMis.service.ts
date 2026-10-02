// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { PostPickupCallMisSearchCriteria } from './postPickupCallMis.model';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

@Injectable()
export class PostPickupCallMisService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'postPickupCallMIS';
  }

  private buildExportPayload(criteria: PostPickupCallMisSearchCriteria) {
    return {
      userID: this.generalService.getUserID(),
      pickupDateFrom: criteria.pickupDateFrom || null,
      pickupDateTo: criteria.pickupDateTo || null,
      postPickupCallFilter: criteria.postPickupCallFilter || 'All',
      pageNumber: 0,
      orderByColumn: criteria.orderByColumn || 'BookingNo',
      order: criteria.order || 'Descending'
    };
  }

  getTableData(criteria: PostPickupCallMisSearchCriteria, pageNumber: number): Observable<any> {
    const payload = {
      pickupDateFrom: criteria.pickupDateFrom || null,
      pickupDateTo: criteria.pickupDateTo || null,
      postPickupCallFilter: criteria.postPickupCallFilter || 'All',
      pageNumber,
      orderByColumn: criteria.orderByColumn || 'BookingNo',
      order: criteria.order || 'Descending'
    };
    return this.httpClient.post(this.API_URL, payload);
  }

  startExportJob(criteria: PostPickupCallMisSearchCriteria): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/ExportCsv/StartJob`, this.buildExportPayload(criteria));
  }

  getExportJobStatus(jobId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/ExportCsv/JobStatus/${jobId}`);
  }

  downloadExportJob(jobId: string): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/ExportCsv/Download/${jobId}`, {
      responseType: 'blob'
    });
  }

  cancelExportJob(jobId: string): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/ExportCsv/Cancel/${jobId}`, {}, {
      params: { userId: String(this.generalService.getUserID() || 0) }
    });
  }

  pollExportJob(jobId: string): Observable<any> {
    return pollExportJob(this.httpClient, `${this.API_URL}/ExportCsv/JobStatus/${jobId}`);
  }

  isExportJobRunning(status: any): boolean {
    return isExportJobRunning(status);
  }

  isExportJobReady(status: any): boolean {
    return isExportJobReady(status);
  }
}
