// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { Filters } from './controlPanelDesign.model';
import moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class ControlPanelDesignService {
  private API_URL: string = '';
  private User_API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  Trip: string;
  constructor(
    private httpClient: HttpClient,
    public datepipe: DatePipe,
    public generalService: GeneralService
  ) {
    this.API_URL = generalService.BaseURL + 'controlPanel/';
    this.User_API_URL = generalService.BaseURL + 'reservationBookerID';
  }

  getReservationHeaderDetails(
    status:string,
    _filters: Filters,
    currentPage: number,
    pageSize: number,
    sortBy:string,
    orderBy:string
  ): Observable<any> {
    const filters = this.normalizeHeaderFilters(_filters);
    return this.httpClient.put(
      this.API_URL +
        'getReservationHeaderDetails'+
        '/' +
        status +
        '/' +
        currentPage +
        '/' +
        pageSize+
        '/' +
        encodeURIComponent(sortBy)+
        '/' +
        encodeURIComponent(orderBy),
      filters
    );
  }

  /** Decoupled total count for CP header grid (Phase 1.4). Same filter payload as list. */
  getReservationHeaderCount(status: string, _filters: Filters): Observable<{ totalRecords: number }> {
    const filters = this.normalizeHeaderFilters(_filters);
    return this.httpClient.put(
      this.API_URL + 'getReservationHeaderCount/' + status,
      filters
    );
  }

  private normalizeHeaderFilters(_filters: Filters): Filters {
    const filters = { ..._filters };

    if (
      filters.reservationID === null ||
      filters.reservationID.toString() === ''
    ) {
      filters.reservationID = 0;
    }

    if (
      filters.dutySlipID === null ||
      filters.dutySlipID === undefined ||
      filters.dutySlipID.toString() === ''
    ) {
      filters.dutySlipID = 0;
    } else {
      const dutySlipId = parseInt(String(filters.dutySlipID).trim(), 10);
      filters.dutySlipID = isNaN(dutySlipId) ? 0 : dutySlipId;
    }

    if (filters.fromDate != '' && filters.fromDate != null) {
      filters.fromDate = this.datepipe.transform(
        filters.fromDate,
        'yyyy-MM-dd'
      );
    }

    if (filters.toDate != '' && filters.toDate != null) {
      filters.toDate = this.datepipe.transform(filters.toDate, 'yyyy-MM-dd');
    }

    if (filters.fromTime != '' && filters.fromTime != null) {
      let fromTime = new Date(filters.fromTime);
      const fromTimes = this.generalService.getTimeApplicableTO(fromTime);
      filters.fromTime = this.datepipe.transform(fromTimes, 'HH:mm:ss');
    }

    if (filters.toTime != '' && filters.toTime != null) {
      let toTime = new Date(filters.toTime);
      const toTimes = this.generalService.getTimeApplicableTO(toTime);
      filters.toTime = this.datepipe.transform(toTimes, 'HH:mm:ss');
    }

    return filters;
  }

  /** Latest SMS/WhatsApp MessageStatus per reservation (batch). */
  getReservationMessagingLatestStatus(reservationIds: number[]): Observable<any> {
    const body = { reservationIds: reservationIds || [] };
    return this.httpClient.post(
      this.API_URL + 'getReservationMessagingLatestStatus',
      body
    );
  }


  getReservationDetails(reservationID:any): Observable<any> {    
    return this.httpClient.get(this.API_URL +'getReservationDetails' +'/' +reservationID);
  }

  getReservationDetailsForAllotmentLite(reservationID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + 'getReservationDetailsForAllotmentLite/' + reservationID);
  }

  getShowAllLocationCheck(employeeID:any): Observable<any> {    
    return this.httpClient.get(this.API_URL +'getShowAllLocationCheck' +'/' +employeeID);
  }

  getDriverAppLatestVersion(): Observable<{ appVersion: string }> {
    return this.httpClient.get<{ appVersion: string }>(
      this.API_URL + 'getDriverAppLatestVersion'
    );
  }

  getReservationDetailsForAllotment(
    _filters: Filters,
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    if (
      _filters.reservationID === null ||
      _filters.reservationID.toString() === ''
    ) {
      _filters.reservationID = 0;
    }

    if (_filters.fromDate != '' && _filters.fromDate != null) {
      _filters.fromDate = this.datepipe.transform(
        _filters.fromDate,
        'yyyy-MM-dd'
      );
    } 

    if (_filters.toDate != '' && _filters.toDate != null) {
      _filters.toDate = this.datepipe.transform(_filters.toDate, 'yyyy-MM-dd');
    } 
    
    
    return this.httpClient.put(
      this.API_URL +
        'getReservationDetailsForAllotment' +
        '/' +
        currentPage +
        '/' +
        pageSize,
      _filters
    );
  }
}


