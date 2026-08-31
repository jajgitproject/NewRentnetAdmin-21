// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { IncidenceMISSearchCriteria } from './incidenceMIS.model';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

@Injectable()
export class IncidenceMISService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'incidenceMIS';
  }

  private buildExportPayload(criteria: IncidenceMISSearchCriteria) {
    return {
      UserID: this.generalService.getUserID(),
      searchCustomerGroup: criteria.searchCustomerGroup || null,
      searchCustomer: criteria.searchCustomer || null,
      searchSalesPerson: criteria.searchSalesPerson || null,
      searchPassengerName: criteria.searchPassengerName || null,
      searchVehicleCategoryID: criteria.searchVehicleCategoryID || 0,
      searchVehicleID: criteria.searchVehicleID || 0,
      searchRegistrationNumber: criteria.searchRegistrationNumber || null,
      searchDriver: criteria.searchDriver || null,
      searchDispatchLocationID: criteria.searchDispatchLocationID || 0,
      searchIncidenceFromDate: criteria.searchIncidenceFromDate || null,
      searchIncidenceToDate: criteria.searchIncidenceToDate || null,
      searchIncidenceTypeID: criteria.searchIncidenceTypeID || 0,
      pageNumber: 0,
      orderByColumn: criteria.orderByColumn || 'IncidenceID',
      order: criteria.order || 'Descending'
    };
  }

  getTableData(criteria: IncidenceMISSearchCriteria, pageNumber: number): Observable<any> {
    const payload = {
      searchCustomerGroup: criteria.searchCustomerGroup || null,
      searchCustomer: criteria.searchCustomer || null,
      searchSalesPerson: criteria.searchSalesPerson || null,
      searchPassengerName: criteria.searchPassengerName || null,
      searchVehicleCategoryID: criteria.searchVehicleCategoryID || 0,
      searchVehicleID: criteria.searchVehicleID || 0,
      searchRegistrationNumber: criteria.searchRegistrationNumber || null,
      searchDriver: criteria.searchDriver || null,
      searchDispatchLocationID: criteria.searchDispatchLocationID || 0,
      searchIncidenceFromDate: criteria.searchIncidenceFromDate || null,
      searchIncidenceToDate: criteria.searchIncidenceToDate || null,
      searchIncidenceTypeID: criteria.searchIncidenceTypeID || 0,
      pageNumber,
      orderByColumn: criteria.orderByColumn || 'IncidenceID',
      order: criteria.order || 'Descending'
    };
    return this.httpClient.post(this.API_URL, payload);
  }

  startExportJob(criteria: IncidenceMISSearchCriteria): Observable<any> {
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

  getCustomerSalesManagerDropDown(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.generalService.BaseURL + 'customerSalesManager/ForDropDown');
  }

  getDriverByPrefix(prefix: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.generalService.BaseURL + `driver/GetAllDriverList/${encodeURIComponent(prefix)}`);
  }
}
