// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { SearchCriteria } from './creditNoteMis.model';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

@Injectable()
export class CreditNoteMisService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'creditNoteMIS';
  }

  private toNull(value: any) {
    if (value === undefined || value === null) {
      return null;
    }
    const text = String(value).trim();
    if (text === '' || text.toLowerCase() === 'null') {
      return null;
    }
    return value;
  }

  private buildExportCriteria(criteria: SearchCriteria) {
    return {
      UserID: this.generalService.getUserID(),
      ShowAllLocation: this.generalService.getShowAllLocation(),
      SearchFromDate: this.toNull(criteria.SearchFromDate),
      SearchToDate: this.toNull(criteria.SearchToDate),
      SearchCreditNoteNumber: this.toNull(criteria.SearchCreditNoteNumber),
      SearchBillNo: this.toNull(criteria.SearchBillNo),
      SearchCustomer: this.toNull(criteria.SearchCustomer),
      SearchBranch: this.toNull(criteria.SearchBranch),
      SearchApprovalStatus: this.toNull(criteria.SearchApprovalStatus)
    };
  }

  startExportJob(criteria: SearchCriteria): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/ExportCsv/StartJob`, this.buildExportCriteria(criteria));
  }

  getExportJobStatus(jobId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/ExportCsv/JobStatus/${jobId}`);
  }

  downloadExportJob(jobId: string): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/ExportCsv/Download/${jobId}`, {
      responseType: 'blob'
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
