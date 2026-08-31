// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

@Injectable()
export class DriverMISService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'driverMIS';
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

  private buildExportPayload(
    searchDriverName: string,
    searchLocation: string,
    searchDateOfJoiningFrom: string,
    searchDateOfJoiningTo: string,
    searchSupplierType: string,
    searchActivationStatus: boolean
  ) {
    return {
      UserID: this.generalService.getUserID(),
      SearchdriverName: this.toNull(searchDriverName),
      searchlocation: this.toNull(searchLocation),
      searchdateofjoiningfrom: this.toNull(searchDateOfJoiningFrom),
      searchdateofjoiningto: this.toNull(searchDateOfJoiningTo),
      searchSupplierType: this.toNull(searchSupplierType),
      SearchActivationStatus: searchActivationStatus === null || searchActivationStatus === undefined ? null : searchActivationStatus
    };
  }

  getTableData(SearchdriverName: string, searchlocation: string, searchdateofjoiningfrom: string, searchdateofjoiningto: string, searchSupplierType: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (SearchdriverName === '') {
      SearchdriverName = 'null';
    }
    if (searchlocation === '') {
      searchlocation = 'null';
    }
    if (searchdateofjoiningfrom === '') {
      searchdateofjoiningfrom = 'null';
    }
    if (searchdateofjoiningto === '') {
      searchdateofjoiningto = 'null';
    }
    if (searchSupplierType === '') {
      searchSupplierType = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + SearchdriverName + '/' + searchlocation + '/' + searchdateofjoiningfrom + '/' + searchdateofjoiningto + '/' + searchSupplierType + '/' + SearchActivationStatus + '/' + PageNumber + '/driverID/Dscending');
  }

  getTableDataSort(SearchdriverName: string, searchlocation: string, searchdateofjoiningfrom: string, searchdateofjoiningto: string, searchSupplierType: string, SearchActivationStatus: boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (SearchdriverName === '') {
      SearchdriverName = 'null';
    }
    if (searchlocation === '') {
      searchlocation = 'null';
    }
    if (searchdateofjoiningfrom === '') {
      searchdateofjoiningfrom = 'null';
    }
    if (searchdateofjoiningto === '') {
      searchdateofjoiningto = 'null';
    }
    if (searchSupplierType === '') {
      searchSupplierType = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + SearchdriverName + '/' + searchlocation + '/' + searchdateofjoiningfrom + '/' + searchdateofjoiningto + '/' + searchSupplierType + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

  startExportJob(
    searchDriverName: string,
    searchLocation: string,
    searchDateOfJoiningFrom: string,
    searchDateOfJoiningTo: string,
    searchSupplierType: string,
    searchActivationStatus: boolean
  ): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}/export/StartJob`,
      this.buildExportPayload(searchDriverName, searchLocation, searchDateOfJoiningFrom, searchDateOfJoiningTo, searchSupplierType, searchActivationStatus)
    );
  }

  getExportJobStatus(jobId: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/export/JobStatus/${jobId}`);
  }

  downloadExportJob(jobId: string): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/export/Download/${jobId}`, {
      responseType: 'blob'
    });
  }

  cancelExportJob(jobId: string): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/export/Cancel/${jobId}`, {}, {
      params: { userId: String(this.generalService.getUserID() || 0) }
    });
  }

  pollExportJob(jobId: string): Observable<any> {
    return pollExportJob(this.httpClient, `${this.API_URL}/export/JobStatus/${jobId}`);
  }

  isExportJobRunning(status: any): boolean {
    return isExportJobRunning(status);
  }

  isExportJobReady(status: any): boolean {
    return isExportJobReady(status);
  }
}
