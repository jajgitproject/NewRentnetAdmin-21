// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

@Injectable()
export class ShowLateAllotmentMISService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'lateAllotmentMIS';
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

  private buildExportPayload(searchFromDate: string, searchToDate: string, searchServiceLocation: string, searchTimeDiff: number) {
    return {
      UserID: this.generalService.getUserID(),
      SearchFromDate: this.toNull(searchFromDate),
      SearchToDate: this.toNull(searchToDate),
      SearchServiceLocation: this.toNull(searchServiceLocation),
      SearchTimeDiff: searchTimeDiff
    };
  }

  getTableData(SearchFromDate: string, SearchToDate: string, SearchServiceLocation: string, SearchTimeDiff: number, PageNumber: number): Observable<any> {
    if (SearchFromDate === '') {
      SearchFromDate = 'null';
    }
    if (SearchToDate === '') {
      SearchToDate = 'null';
    }
    if (SearchServiceLocation === '') {
      SearchServiceLocation = 'null';
    }
    return this.httpClient.get(this.API_URL + '/' + 'getAllLateAllotment' + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchServiceLocation + '/' + SearchTimeDiff + '/' + PageNumber + '/ReservationID/Descending');
  }

  getTableDataSort(SearchFromDate: string, SearchToDate: string, SearchServiceLocation: string, SearchTimeDiff: number, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (SearchFromDate === '') {
      SearchFromDate = 'null';
    }
    if (SearchToDate === '') {
      SearchToDate = 'null';
    }
    if (SearchServiceLocation === '') {
      SearchServiceLocation = 'null';
    }
    return this.httpClient.get(this.API_URL + '/' + 'getAllLateAllotment' + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchServiceLocation + '/' + SearchTimeDiff + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

  startExportJob(searchFromDate: string, searchToDate: string, searchServiceLocation: string, searchTimeDiff: number): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}/exportLateAllotment/StartJob`,
      this.buildExportPayload(searchFromDate, searchToDate, searchServiceLocation, searchTimeDiff)
    );
  }

  getExportJobStatus(jobId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/exportLateAllotment/JobStatus/${jobId}`);
  }

  downloadExportJob(jobId: string): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/exportLateAllotment/Download/${jobId}`, {
      responseType: 'blob'
    });
  }

  cancelExportJob(jobId: string): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/exportLateAllotment/Cancel/${jobId}`, {}, {
      params: { userId: String(this.generalService.getUserID() || 0) }
    });
  }

  pollExportJob(jobId: string): Observable<any> {
    return pollExportJob(this.httpClient, `${this.API_URL}/exportLateAllotment/JobStatus/${jobId}`);
  }

  isExportJobRunning(status: any): boolean {
    return isExportJobRunning(status);
  }

  isExportJobReady(status: any): boolean {
    return isExportJobReady(status);
  }
}
