// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationMessaging } from './reservationMessaging.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ReservationMessagingService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "messageLogs";
  }
  /** CRUD METHODS */
  // getTableData(reservationID:any, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  // {
  //   return this.httpClient.get(this.API_URL + "/" +reservationID + '/' + SearchActivationStatus +'/' + PageNumber + '/ReservationMessagingID/Ascending');
  // }

  getTableData(reservationID: number,allotmentID:number, searchMessageType: string, searchMessageSource: string, searchRecipientName: string, searchmessagingStatus: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (reservationID === 0) {
      reservationID = 0;
    }
    if (allotmentID === 0 || allotmentID === null) {
      allotmentID = 0;
    }

    if (searchMessageType === "") {
      searchMessageType = null;
    }

    if (searchMessageSource === "") {
      searchMessageSource = null;
    }

    if (searchRecipientName === "") {
      searchRecipientName = null;
    }
    if (searchmessagingStatus === "") {
      searchmessagingStatus = null;
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + reservationID + '/'+ allotmentID + '/' + searchMessageType + '/' + searchMessageSource + '/' + searchRecipientName + '/' + searchmessagingStatus + '/' + SearchActivationStatus + '/' + PageNumber + '/MessageID/Descending');
  }

  getTableDataSort(reservationID: number,allotmentID:number, searchMessageType: string, searchMessageSource: string, searchRecipientName: string, searchmessagingStatus: string, SearchActivationStatus: boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (reservationID === 0) {
      reservationID = 0;
    }
    if (allotmentID === 0) {
      allotmentID = 0;
    }

    if (searchMessageType === "") {
      searchMessageType = null;
    }

    if (searchMessageSource === "") {
      searchMessageSource = null;
    }

    if (searchRecipientName === "") {
      searchRecipientName = null;
    }
    if (searchmessagingStatus === "") {
      searchmessagingStatus = null;
    }

    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    //console.log(this.API_URL + "/" + reservationID + '/' + searchMessageType + '/' + searchMessageSource + '/' + searchRecipientName + '/' + searchmessagingStatus + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType)
    return this.httpClient.get(this.API_URL + "/" + reservationID + '/'+ allotmentID + '/' + searchMessageType + '/' + searchMessageSource + '/' + searchRecipientName + '/' + searchmessagingStatus + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

}


