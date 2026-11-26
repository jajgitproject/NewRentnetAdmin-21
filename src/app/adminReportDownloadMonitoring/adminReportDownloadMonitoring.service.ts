// @ts-nocheck
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class AdminReportDownloadMonitoringService {
  constructor(
    private httpClient: HttpClient,
    private generalService: GeneralService
  ) {}

  private get baseUrl(): string {
    return this.generalService.BaseURL + 'misExportJobs';
  }

  listMonitoring(reportType?: string, status?: string): Observable<any> {
    let params = new HttpParams();
    if (reportType) {
      params = params.set('reportType', reportType);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.httpClient.get(`${this.baseUrl}/admin/monitoring`, { params });
  }

  cancel(jobId: string): Observable<any> {
    const cancelledByUserId = this.generalService.getUserID() || 0;
    return this.httpClient.post(
      `${this.baseUrl}/admin/cancel/${jobId}`,
      {},
      { params: { cancelledByUserId: String(cancelledByUserId) } }
    );
  }

  getFields(jobId: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/admin/${jobId}/fields`);
  }
}
