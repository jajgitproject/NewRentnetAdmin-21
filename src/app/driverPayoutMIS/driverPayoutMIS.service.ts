// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { SearchCriteria } from './driverPayoutMIS.model';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';

@Injectable()
export class DriverPayoutMISService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'driverPayoutMIS';
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

  private buildPayload(criteria: SearchCriteria, pageNumber?: number, order?: string, orderByColumn?: string) {
    return {
      UserID: criteria.UserID || this.generalService.getUserID(),
      SearchCustomer: this.toNull(criteria.SearchCustomer),
      SearchFromDate: this.toNull(criteria.SearchFromDate),
      SearchToDate: this.toNull(criteria.SearchToDate),
      SearchDri: this.toNull(criteria.SearchDri),
      SearchDriverType: this.toNull(criteria.SearchDriverType),
      SearchSupplierType: this.toNull(criteria.SearchSupplierType),
      SearchCity: this.toNull(criteria.SearchCity),
      SearchDispatchLocationName: this.toNull(criteria.SearchDispatchLocation),
      PageNumber: pageNumber ?? criteria.PageNumber ?? 0,
      Order: order ?? criteria.Order ?? 'Descending',
      OrderByColumn: orderByColumn ?? criteria.OrderByColumn ?? 'ReservationID'
    };
  }

  getTableData(criteria: SearchCriteria, pageNumber: number): Observable<any> {
    return this.httpClient.post(this.API_URL, this.buildPayload(criteria, pageNumber));
  }

  getTableDataSort(criteria: SearchCriteria, pageNumber: number, columnName: string, sortType: string): Observable<any> {
    return this.httpClient.post(this.API_URL, this.buildPayload(criteria, pageNumber, sortType, columnName));
  }

  exportCsv(criteria: SearchCriteria): Observable<Blob> {
    return this.httpClient.post(`${this.API_URL}/ExportCsv`, this.buildPayload(criteria), {
      responseType: 'blob'
    });
  }

  startExportJob(criteria: SearchCriteria): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/ExportCsv/StartJob`, this.buildPayload(criteria));
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
    return timer(0, 3000).pipe(
      switchMap(() => this.getExportJobStatus(jobId)),
      takeWhile((status: any) => this.isExportJobRunning(status), true)
    );
  }

  isExportJobRunning(status: any): boolean {
    const current = String(status?.status ?? status?.Status ?? '').toLowerCase();
    return current === 'pending' || current === 'running';
  }

  isExportJobReady(status: any): boolean {
    const current = String(status?.status ?? status?.Status ?? '').toLowerCase();
    return current === 'completed' && (status?.fileReady ?? status?.FileReady ?? false);
  }

  GetLocationDropDownForDutyRegister(isKamRole: boolean): Observable<OrganizationalEntityDropDown[]> {
    const userId = this.generalService.getUserID();
    return this.httpClient.get<OrganizationalEntityDropDown[]>(
      this.generalService.BaseURL + 'dutyRegister/GetLocationDropDownForDutyRegister/' + userId + '/' + isKamRole
    );
  }

  GetCustomerByKAMForDutyRegister(isKamRole: boolean): Observable<any[]> {
    const userId = this.generalService.getUserID();
    return this.httpClient.get<any[]>(
      this.generalService.BaseURL + 'dutyRegister/GetCustomerByKAMForDutyRegister/' + userId + '/' + isKamRole
    );
  }
}
