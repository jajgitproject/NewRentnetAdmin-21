// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

@Injectable()
export class AppDutyMISService 
{
  private API_URL:string = '';
  isTblLoading = true;
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "appDutyMIS";
  }

  private toRouteSegment(value: string | boolean | null | undefined): string {
    if (value === '' || value === null || value === undefined) {
      return 'null';
    }
    return encodeURIComponent(String(value));
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

  private buildExportCriteria(fromDate: string, toDate: string, dispatchLocation: string, activationStatus: boolean) {
    return {
      FromDate: this.toNull(fromDate),
      ToDate: this.toNull(toDate),
      LocationDispatch: this.toNull(dispatchLocation),
      ActivationStatus: activationStatus === null || activationStatus === undefined ? null : String(activationStatus),
      OrderByColumn: 'ReservationID',
      Order: 'Descending'
    };
  }

  getTableData(searchFromDate:string,searchToDate:string, DispatchLocation:string ,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(
      `${this.API_URL}/${this.toRouteSegment(searchFromDate)}/${this.toRouteSegment(searchToDate)}/${this.toRouteSegment(DispatchLocation)}/${this.toRouteSegment(SearchActivationStatus)}/${PageNumber}/ReservationID/Descending`
    );
  }

  getTableDataSort(searchFromDate:string,searchToDate:string, DispatchLocation:string ,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    return this.httpClient.get(
      `${this.API_URL}/${this.toRouteSegment(searchFromDate)}/${this.toRouteSegment(searchToDate)}/${this.toRouteSegment(DispatchLocation)}/${this.toRouteSegment(SearchActivationStatus)}/${PageNumber}/${encodeURIComponent(coloumName)}/${encodeURIComponent(sortType)}`
    );
  }

  startExportJob(fromDate: string, toDate: string, dispatchLocation: string, activationStatus: boolean): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}/ExportCsv/StartJob`,
      this.buildExportCriteria(fromDate, toDate, dispatchLocation, activationStatus)
    );
  }

  getExportJobStatus(jobId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/ExportCsv/JobStatus/${jobId}`);
  }

  downloadExportJob(jobId: string): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/ExportCsv/Download/${jobId}`, { responseType: 'blob' });
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

  /** @deprecated Use startExportJob */
  downloadCsv(searchFromDate: string, searchToDate: string, dispatchLocation: string, searchActivationStatus: boolean): Observable<Blob>
  {
    return this.httpClient.get(
      `${this.API_URL}/export/${this.toRouteSegment(searchFromDate)}/${this.toRouteSegment(searchToDate)}/${this.toRouteSegment(dispatchLocation)}/${this.toRouteSegment(searchActivationStatus)}`,
      { responseType: 'blob' }
    );
  }
}
