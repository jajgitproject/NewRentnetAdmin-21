// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

@Injectable()
export class ShowLateDispatchMISService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'lateAllotmentMIS';
  }

  private toRouteParam(value: string): string {
    const routeValue = value === '' ? 'null' : value;
    return encodeURIComponent(routeValue);
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
    return this.httpClient.get(
      this.API_URL + '/getAllLateDispatch/' +
      this.toRouteParam(SearchFromDate) + '/' +
      this.toRouteParam(SearchToDate) + '/' +
      this.toRouteParam(SearchServiceLocation) + '/' +
      SearchTimeDiff + '/' +
      PageNumber + '/ReservationID/Descending'
    );
  }

  getTableDataSort(SearchFromDate: string, SearchToDate: string, SearchServiceLocation: string, SearchTimeDiff: number, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/getAllLateDispatch/' +
      this.toRouteParam(SearchFromDate) + '/' +
      this.toRouteParam(SearchToDate) + '/' +
      this.toRouteParam(SearchServiceLocation) + '/' +
      SearchTimeDiff + '/' +
      PageNumber + '/' +
      encodeURIComponent(coloumName) + '/' +
      encodeURIComponent(sortType)
    );
  }

  startExportJob(searchFromDate: string, searchToDate: string, searchServiceLocation: string, searchTimeDiff: number): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}/exportLateDispatch/StartJob`,
      this.buildExportPayload(searchFromDate, searchToDate, searchServiceLocation, searchTimeDiff)
    );
  }

  getExportJobStatus(jobId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/exportLateDispatch/JobStatus/${jobId}`);
  }

  downloadExportJob(jobId: string): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/exportLateDispatch/Download/${jobId}`, {
      responseType: 'blob'
    });
  }

  cancelExportJob(jobId: string): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/exportLateDispatch/Cancel/${jobId}`, {}, {
      params: { userId: String(this.generalService.getUserID() || 0) }
    });
  }

  pollExportJob(jobId: string): Observable<any> {
    return pollExportJob(this.httpClient, `${this.API_URL}/exportLateDispatch/JobStatus/${jobId}`);
  }

  isExportJobRunning(status: any): boolean {
    return isExportJobRunning(status);
  }

  isExportJobReady(status: any): boolean {
    return isExportJobReady(status);
  }
}
