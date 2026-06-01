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
  getTableData(
              SearchRequestFromDate:string,
              SearchRequestToDate:string,
              SearchTRN:string,
              SearchiTRN:string,
              SearchCustomerGroup:string,
              SearchEcoBookingNo:string,
              SearchConfirmByEco:boolean,
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
    else {
      SearchTRN = encodeURIComponent(SearchTRN);
    }
    if(SearchiTRN === "")
    {
      SearchiTRN=null;
    }
    else {
      SearchiTRN = encodeURIComponent(SearchiTRN);
    }
    if(SearchCustomerGroup === "")
    {
      SearchCustomerGroup=null;
    }
    if(SearchEcoBookingNo === "")
    {
      SearchEcoBookingNo=null;
    }
    console.log(this.API_URL + '/' + SearchRequestFromDate + '/' + SearchRequestToDate + '/' + SearchTRN + '/' + SearchiTRN + '/' + SearchCustomerGroup + '/' + SearchEcoBookingNo + '/' + SearchConfirmByEco + '/' + PageNumber + '/IntegrationRequestID/Descending');
    return this.httpClient.get(this.API_URL + '/' + SearchRequestFromDate + '/' + SearchRequestToDate + '/' + SearchTRN + '/' + SearchiTRN + '/' + SearchCustomerGroup + '/' + SearchEcoBookingNo + '/' + SearchConfirmByEco + '/' + PageNumber + '/IntegrationRequestID/Descending');

  }

  getTableDataSort(
              SearchRequestFromDate:string,
              SearchRequestToDate:string,
              SearchTRN:string,
              SearchiTRN:string,
              SearchCustomerGroup:string,
              SearchEcoBookingNo:string,
              SearchConfirmByEco:boolean,PageNumber: number, coloumName: string, sortType: string): Observable<any> 
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
    else {
      SearchTRN = encodeURIComponent(SearchTRN);
    }
    if(SearchiTRN === "")
    {
      SearchiTRN=null;
    }
    else {
      SearchiTRN = encodeURIComponent(SearchiTRN);
    }
    if(SearchCustomerGroup === "")
    {
      SearchCustomerGroup=null;
    }
    if(SearchEcoBookingNo === "")
    {
      SearchEcoBookingNo=null;
    }
    return this.httpClient.get(this.API_URL + '/' + SearchRequestFromDate + '/' + SearchRequestToDate + '/' + SearchTRN + '/' + SearchiTRN + '/' + SearchCustomerGroup + '/' + SearchEcoBookingNo + '/' + SearchConfirmByEco + '/' +  PageNumber + '/' + coloumName + '/' + sortType);

  }

}
