// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, takeWhile } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
@Injectable()
export class FeedbackEmailMISService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "feedbackEmailMIS";
  }


  /** CRUD METHODS */
  getTableData(searchReservationID: string, searchDutySlipID: string, searchCustomer: string, searchIsAllotted: string,
    searchFromDate: string, searchToDate: string, PageNumber: number): Observable<any> {
    return this.httpClient.get(this.buildSearchUrl(
      searchReservationID, searchDutySlipID, searchCustomer, searchIsAllotted,
      searchFromDate, searchToDate, PageNumber, 'PickupDate', 'Descending'));
  }

  getTableDataSort(searchReservationID: string, searchDutySlipID: string, searchCustomer: string, searchIsAllotted: string,
    searchFromDate: string, searchToDate: string, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    return this.httpClient.get(this.buildSearchUrl(
      searchReservationID, searchDutySlipID, searchCustomer, searchIsAllotted,
      searchFromDate, searchToDate, PageNumber, coloumName, sortType));
  }

  private buildSearchUrl(searchReservationID: string, searchDutySlipID: string, searchCustomer: string, searchIsAllotted: string,
    searchFromDate: string, searchToDate: string, PageNumber: number, coloumName: string, sortType: string): string {
    return this.API_URL + '/'
      + this.toPathValue(searchReservationID) + '/'
      + this.toPathValue(searchDutySlipID) + '/'
      + this.toPathValue(searchCustomer) + '/'
      + this.toPathValue(searchIsAllotted) + '/'
      + this.toPathValue(searchFromDate) + '/'
      + this.toPathValue(searchToDate) + '/'
      + PageNumber + '/'
      + coloumName + '/'
      + sortType;
  }

  private toPathValue(value: string): string {
    if (value === undefined || value === null || String(value).trim() === '') {
      return 'null';
    }
    return encodeURIComponent(String(value).trim());
  }

  startSendJob(reservationIDs: number[], senderEmployeeID: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(
      this.API_URL + '/SendFeedbackEmail/StartJob',
      {
        reservationIDs: reservationIDs,
        senderEmployeeID: senderEmployeeID
      },
      httpOptions
    );
  }

  getSendJobStatus(jobId: string): Observable<any> {
    return this.httpClient.get(this.API_URL + '/SendFeedbackEmail/JobStatus/' + jobId);
  }

  pollSendJob(jobId: string): Observable<any> {
    return timer(0, 3000).pipe(
      switchMap(() => this.getSendJobStatus(jobId)),
      takeWhile((status: any) => this.isSendJobRunning(status), true)
    );
  }

  isSendJobRunning(status: any): boolean {
    const current = String(status?.status ?? status?.Status ?? '').toLowerCase();
    return current === 'pending' || current === 'running';
  }
}
