// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

@Injectable()
export class CarMasterMISService {
  private API_URL = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'carMasterMIS';
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

  private toRouteParam(value: string): string {
    return value === '' ? 'null' : value;
  }

  private buildExportPayload(
    searchVehicleCategory: string,
    searchVehicle: string,
    searchCarLocation: string,
    searchOwnedSupplier: string,
    status: string,
    searchGps: string,
    searchCompany: string,
    searchActivationStatus: string
  ) {
    return {
      UserID: this.generalService.getUserID(),
      SearchVehcileCategory: this.toNull(searchVehicleCategory),
      SearchVehicle: this.toNull(searchVehicle),
      searchcarLocation: this.toNull(searchCarLocation),
      searchownedSupplier: this.toNull(searchOwnedSupplier),
      status: this.toNull(status),
      searchGps: this.toNull(searchGps),
      searchCompany: this.toNull(searchCompany),
      SearchActivationStatus: this.toNull(searchActivationStatus)
    };
  }

  getTableData(
    SearchVehcileCategory: string,
    SearchVehicle: string,
    searchcarLocation: string,
    searchownedSupplier: string,
    status: string,
    searchGps: string,
    searchCompany: string,
    SearchActivationStatus: string,
    PageNumber: number
  ): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/' +
      this.toRouteParam(SearchVehcileCategory) + '/' +
      this.toRouteParam(SearchVehicle) + '/' +
      this.toRouteParam(searchcarLocation) + '/' +
      this.toRouteParam(searchownedSupplier) + '/' +
      this.toRouteParam(status) + '/' +
      this.toRouteParam(searchGps) + '/' +
      this.toRouteParam(searchCompany) + '/' +
      this.toRouteParam(SearchActivationStatus) + '/' +
      PageNumber + '/InventoryID/Ascending'
    );
  }

  getTableDataSort(
    SearchVehcileCategory: string,
    SearchVehicle: string,
    searchcarLocation: string,
    searchownedSupplier: string,
    status: string,
    searchGps: string,
    searchCompany: string,
    SearchActivationStatus: string,
    PageNumber: number,
    coloumName: string,
    sortType: string
  ): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/' +
      this.toRouteParam(SearchVehcileCategory) + '/' +
      this.toRouteParam(SearchVehicle) + '/' +
      this.toRouteParam(searchcarLocation) + '/' +
      this.toRouteParam(searchownedSupplier) + '/' +
      this.toRouteParam(status) + '/' +
      this.toRouteParam(searchGps) + '/' +
      this.toRouteParam(searchCompany) + '/' +
      this.toRouteParam(SearchActivationStatus) + '/' +
      PageNumber + '/' + coloumName + '/' + sortType
    );
  }

  startExportJob(
    searchVehicleCategory: string,
    searchVehicle: string,
    searchCarLocation: string,
    searchOwnedSupplier: string,
    status: string,
    searchGps: string,
    searchCompany: string,
    searchActivationStatus: string
  ): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}/export/StartJob`,
      this.buildExportPayload(searchVehicleCategory, searchVehicle, searchCarLocation, searchOwnedSupplier, status, searchGps, searchCompany, searchActivationStatus)
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
