// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { SearchCriteria } from './bookingMis.model';
import { isExportJobReady, isExportJobRunning, pollExportJob } from '../general/export-job.helper';

@Injectable()
export class BookingMisService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'bookingMIS';
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
      ShowAllLocation: null,
      SearchModeOfPayment: this.toNull(criteria.SearchModeOfPayment),
      SearchServiceLocation: this.toNull(criteria.SearchServiceLocation),
      SearchCustomer: this.toNull(criteria.SearchCustomer),
      SearchDutySlip: this.toNull(criteria.SearchDutySlip),
      SearchManualDS: this.toNull(criteria.SearchManualDS),
      SearchBooking: this.toNull(criteria.SearchBooking),
      SearchCity: this.toNull(criteria.SearchCity),
      SearchFromDate: this.toNull(criteria.SearchFromDate),
      SearchToDate: this.toNull(criteria.SearchToDate),
      SearchCancellationFrom: this.toNull(criteria.SearchCancellationFrom),
      SearchCancellationTo: this.toNull(criteria.SearchCancellationTo),
      SearchSalesPerson: this.toNull(criteria.SearchSalesPerson),
      SearchDispatchStatus: this.toNull(criteria.SearchDispatchStatus),
      SearchBookingStatus: this.toNull(criteria.SearchBookingStatus),
      SearchCustomerLocation: this.toNull(criteria.SearchCustomerLocation),
      SearchGuestName: this.toNull(criteria.SearchGuestName),
      SearchPickupDetail: this.toNull(criteria.SearchPickupDetail),
      SearchPickupSubDetail: this.toNull(criteria.SearchPickupSubDetail),
      SearchCustomerGroup: this.toNull(criteria.SearchCustomerGroup),
      SearchBookerName: this.toNull(criteria.SearchBookerName)
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
}
