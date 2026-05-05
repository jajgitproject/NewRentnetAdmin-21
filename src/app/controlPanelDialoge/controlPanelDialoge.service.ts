// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { Filters } from '../controlPanelDesign/controlPanelDesign.model';
@Injectable()
export class ControlPanelDialogeService
{
  private API_URL: string = '';
  private User_API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  Trip: string;
  private API_URL_Closing: string = '';
    constructor(
      private httpClient: HttpClient,
      public datepipe: DatePipe,
      public generalService: GeneralService
    ) {
      this.API_URL = generalService.BaseURL + 'controlPanel/';
      this.User_API_URL = generalService.BaseURL + 'reservationBookerID';
      this.API_URL_Closing = generalService.BaseURL + 'Closing';
    }
  
    getReservationHeaderDetails(
      status:string,
      _filters: Filters,
      currentPage: number,
      pageSize: number,
      sortBy:string,
      orderBy:string
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
  
  
      if (_filters.fromTime != '' && _filters.fromTime != null) {
        let fromTime = new Date(_filters.fromTime); 
        const fromTimes=this.generalService.getTimeApplicableTO(fromTime);
        _filters.fromTime = this.datepipe.transform(fromTimes, 'HH:mm:ss');
      }
  
      if (_filters.toTime != '' && _filters.toTime != null) {
        let toTime = new Date(_filters.toTime); 
        const toTimes=this.generalService.getTimeApplicableTO(toTime);
        _filters.toTime = this.datepipe.transform(toTimes, 'HH:mm:ss'); 
      }
  
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
          sortBy+
          '/' +
          orderBy,
        _filters
      );
    }
  
  
    getReservationDetails(reservationID:any): Observable<any> {    
      return this.httpClient.get(this.API_URL +'getReservationDetails' +'/' +reservationID);
    }
  
    getShowAllLocationCheck(employeeID:any): Observable<any> {    
      return this.httpClient.get(this.API_URL +'getShowAllLocationCheck' +'/' +employeeID);
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
  
  getVerifyDutyStatus(ReservationID:any): Observable<any> 
  {    
    return this.httpClient.get(this.API_URL_Closing + '/' + 'GetVerifyDutyStatus' + '/' + ReservationID);
  }
   getGoodForBillingStatus(ReservationID:any): Observable<any> 
  {    
    return this.httpClient.get(this.API_URL_Closing + '/' + 'GetGoodForBillingStatus' + '/' + ReservationID);
  }
   checkInvoiceNumber(ReservationID:any): Observable<any> 
  {    
    return this.httpClient.get(this.API_URL + 'CheckInvoiceNumber' + '/' + ReservationID);
  }
   getInvoiceType(invoiceID:any): Observable<any>{
     
  return this.httpClient.get(this.API_URL + 'GetInvoiceType' + "/" + invoiceID);
  }
}
  

