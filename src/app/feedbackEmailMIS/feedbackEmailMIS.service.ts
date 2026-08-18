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
  getTableData(searchDutySlipID: string, searchFromDate: string,
    searchToDate: string, PageNumber: number): Observable<any> {

    if (searchDutySlipID === "") {
      searchDutySlipID = "null";
    } else {
      searchDutySlipID = encodeURIComponent(searchDutySlipID);
    }
    if (searchFromDate === "") {
      searchFromDate = "null";
    }
    if (searchToDate === "") {
      searchToDate = "null";
    }
    return this.httpClient.get(this.API_URL + "/" + searchDutySlipID + '/' + searchFromDate + '/' + searchToDate + '/' + PageNumber + '/PickupDate/Descending');

  }

  getTableDataSort(searchDutySlipID: string, searchFromDate: string, searchToDate: string,
    PageNumber: number, coloumName: string, sortType: string): Observable<any> {

      if (searchDutySlipID === "") {
        searchDutySlipID = "null";
      } else {
        searchDutySlipID = encodeURIComponent(searchDutySlipID);
      }

    if (searchFromDate === "") {
      searchFromDate = "null";
    }
    if (searchToDate === "") {
      searchToDate = "null";
    }
    return this.httpClient.get(this.API_URL + "/" + searchDutySlipID + '/' + searchFromDate + '/' + searchToDate + '/' + PageNumber + '/' + coloumName + '/' + sortType);

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
