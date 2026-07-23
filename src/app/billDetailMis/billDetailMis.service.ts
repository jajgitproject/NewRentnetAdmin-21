// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { SearchCriteria } from './billDetailMis.model';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';

@Injectable()
export class BillDetailMisService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'billDetailMIS';
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
      SearchCustomerGroup: this.toNull(criteria.SearchCustomerGroup),
      SearchCustomer: this.toNull(criteria.SearchCustomer),
      SearchDispatchLocationName: this.toNull(criteria.SearchDispatchLocation),
      SearchMOP: this.toNull(criteria.SearchMOP),
      SearchSupplierType: this.toNull(criteria.SearchSupplierType),
      SearchSupplierName: this.toNull(criteria.SearchSupplier),
      SearchFromDate: this.toNull(criteria.SearchFromDate),
      SearchToDate: this.toNull(criteria.SearchToDate),
      SearchSupplierO: this.toNull(criteria.SearchSupplierO),
      SearchDri: this.toNull(criteria.SearchDri),
      SearchCarNo: this.toNull(criteria.SearchCarNo),
      SearchCity: this.toNull(criteria.SearchCity),
      SearchBookingStatus: this.toNull(criteria.SearchBookingStatus),
      SearchBillFromDate: this.toNull(criteria.SearchBillFromDate),
      SearchBillToDate: this.toNull(criteria.SearchBillToDate)
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

  GetCustomerGroupByKAMForDutyRegister(isKamRole: boolean): Observable<any[]> {
    const userId = this.generalService.getUserID();
    return this.httpClient.get<any[]>(
      this.generalService.BaseURL + 'dutyRegister/GetCustomerGroupByKAMForDutyRegister/' + userId + '/' + isKamRole
    );
  }

  GetCustomerByKAMForDutyRegister(isKamRole: boolean): Observable<any[]> {
    const userId = this.generalService.getUserID();
    return this.httpClient.get<any[]>(
      this.generalService.BaseURL + 'dutyRegister/GetCustomerByKAMForDutyRegister/' + userId + '/' + isKamRole
    );
  }
}
