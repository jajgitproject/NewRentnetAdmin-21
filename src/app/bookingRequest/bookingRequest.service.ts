// @ts-nocheck
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


  /** CRUD METHODS */
  getTableData(SearchFromDate:string,
              SearchToDate:string,
              SearchRequestFromDate:string,
              SearchRequestToDate:string,
              SearchTRN:string,
              SearchCustomer:string,
              SearchEcoBookingNo:string,
              SearchStatus:string,
              PageNumber: number): Observable<any> {
    if(SearchFromDate === "")
    {
      SearchFromDate=null;
    }
    if(SearchToDate === "")
    {
      SearchToDate=null;
    }
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
    else {
      SearchTRN = encodeURIComponent(SearchTRN);
    }
    if(SearchCustomer === "")
    {
      SearchCustomer=null;
    }
    if(SearchEcoBookingNo === "")
    {
      SearchEcoBookingNo=null;
    }
    if(SearchStatus === "")
    {
      SearchStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchRequestFromDate + '/' + SearchRequestToDate + '/' + SearchTRN + '/' + SearchCustomer + '/' + SearchEcoBookingNo + '/' + SearchStatus + '/' + PageNumber + '/IntegrationRequestID/Descending');

  }

  getTableDataSort(SearchFromDate:string,
              SearchToDate:string,
              SearchRequestFromDate:string,
              SearchRequestToDate:string,
              SearchTRN:string,
              SearchCustomer:string,
              SearchEcoBookingNo:string,
              SearchStatus:string,PageNumber: number, coloumName: string, sortType: string): Observable<any> 
  {
    if(SearchFromDate === "")
    {
      SearchFromDate=null;
    }
    if(SearchToDate === "")
    {
      SearchToDate=null;
    }
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
    else {
      SearchTRN = encodeURIComponent(SearchTRN);
    }
    if(SearchCustomer === "")
    {
      SearchCustomer=null;
    }
    if(SearchEcoBookingNo === "")
    {
      SearchEcoBookingNo=null;
    }
    if(SearchStatus === "")
    {
      SearchStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchRequestFromDate + '/' + SearchRequestToDate + '/' + SearchTRN + '/' + SearchCustomer + '/' + SearchEcoBookingNo + '/' + SearchStatus + '/' +  PageNumber + '/' + coloumName + '/' + sortType);

  }

}
