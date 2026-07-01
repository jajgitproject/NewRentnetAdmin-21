import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class BookingRequestService {
  private API_URL: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "bookingRequest";
  }

  private toRouteSegment(value: string | boolean | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return 'null';
    }
    return encodeURIComponent(String(value));
  }

  private buildListUrl(
    SearchRequestFromDate: string,
    SearchRequestToDate: string,
    SearchTRN: string,
    SearchiTRN: string,
    SearchCustomerGroup: string,
    SearchEcoBookingNo: string,
    SearchConfirmByEco: boolean | null,
    PageNumber: number,
    orderByColumn: string,
    order: string
  ): string {
    return [
      this.API_URL,
      this.toRouteSegment(SearchRequestFromDate),
      this.toRouteSegment(SearchRequestToDate),
      this.toRouteSegment(SearchTRN),
      this.toRouteSegment(SearchiTRN),
      this.toRouteSegment(SearchCustomerGroup),
      this.toRouteSegment(SearchEcoBookingNo),
      this.toRouteSegment(SearchConfirmByEco),
      PageNumber,
      orderByColumn,
      order
    ].join('/');
  }

  /** CRUD METHODS */
  getTableData(
              SearchRequestFromDate:string,
              SearchRequestToDate:string,
              SearchTRN:string,
              SearchiTRN:string,
              SearchCustomerGroup:string,
              SearchEcoBookingNo:string,
              SearchConfirmByEco: boolean | null,
              PageNumber: number): Observable<any> {
    if(SearchRequestFromDate === "")
    {
      SearchRequestFromDate=null;
    }
    if(SearchRequestToDate === "")
    {
      SearchRequestToDate=null;
    }
    if(SearchTRN === "")
    {
      SearchTRN=null;
    }
    if(SearchiTRN === "")
    {
      SearchiTRN=null;
    }
    if(SearchCustomerGroup === "")
    {
      SearchCustomerGroup=null;
    }
    if(SearchEcoBookingNo === "")
    {
      SearchEcoBookingNo=null;
    }
    const url = this.buildListUrl(
      SearchRequestFromDate,
      SearchRequestToDate,
      SearchTRN,
      SearchiTRN,
      SearchCustomerGroup,
      SearchEcoBookingNo,
      SearchConfirmByEco,
      PageNumber,
      'IntegrationRequestID',
      'Descending'
    );
    console.log(url);
    return this.httpClient.get(url);

  }

  getTableDataSort(
              SearchRequestFromDate:string,
              SearchRequestToDate:string,
              SearchTRN:string,
              SearchiTRN:string,
              SearchCustomerGroup:string,
              SearchEcoBookingNo:string,
              SearchConfirmByEco: boolean | null,PageNumber: number, coloumName: string, sortType: string): Observable<any> 
  {
    if(SearchRequestFromDate === "")
    {
      SearchRequestFromDate=null;
    }
    if(SearchRequestToDate === "")
    {
      SearchRequestToDate=null;
    }
    if(SearchTRN === "")
    {
      SearchTRN=null;
    }
    if(SearchiTRN === "")
    {
      SearchiTRN=null;
    }
    if(SearchCustomerGroup === "")
    {
      SearchCustomerGroup=null;
    }
    if(SearchEcoBookingNo === "")
    {
      SearchEcoBookingNo=null;
    }
    return this.httpClient.get(this.buildListUrl(
      SearchRequestFromDate,
      SearchRequestToDate,
      SearchTRN,
      SearchiTRN,
      SearchCustomerGroup,
      SearchEcoBookingNo,
      SearchConfirmByEco,
      PageNumber,
      coloumName,
      sortType
    ));

  }

}
