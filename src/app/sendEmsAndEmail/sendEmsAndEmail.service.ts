// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SendEmsAndEmail } from './sendEmsAndEmail.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable()
export class SendEmsAndEmailService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {
    this.API_URL = generalService.BaseURL + 'controlPanel/';
  }
  /** CRUD METHODS */

  // getTableNotificationData(reservationID:number, additionalData:any):  Observable<any>
  // {

  //   return this.httpClient.get(this.API_URL  +'/sendNotifications'+ "/"+ reservationID,additionalData);
  // }

  getTableNotificationData(reservationID: number, additionalData: any, pickupDate: any) {
    var UserID = this.generalService.getUserID();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const requestBody = {
      addtionalDetails:additionalData,
      pickupDate: pickupDate
    };

    return this.httpClient.post(
      this.API_URL + 'sendNotifications' + '/' + UserID + '/' + reservationID,
      requestBody,
      httpOptions
    );
  }

  getTableData(
    SearchActivationStatus: boolean,
    PageNumber: number
  ): Observable<any> {
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(
      this.API_URL +
        '/' +
        SearchActivationStatus +
        '/' +
        PageNumber +
        '/SendEmsAndEmail/Ascending'
    );
  }
  getDispatchCurrentData(
    pickupDate: string,
    pickupTime: string
  ): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/fetchCurrentDataFromApp/' + pickupDate + '/' + pickupTime
    );
  }
  GetDispatchPreviousData(
    pickupDate: string,
    pickupTime: string
  ): Observable<any> {
    return this.httpClient.get(
      this.API_URL +
        '/fetchPreviousDataFromApp/' +
        pickupDate +
        '/' +
        pickupTime
    );
  }
  GetNextDispatchData(pickupDate: string, pickupTime: string): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/fetchNextDataFromApp/' + pickupDate + '/' + pickupTime
    );
  }

  add(advanceTable: SendEmsAndEmail) {
    //advanceTable.sendEmsAndEmailID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: SendEmsAndEmail) {
    // advanceTable.locationOutDateString=this.generalService.getTimeApplicable(advanceTable.locationOutDate);
    //advanceTable.locationOutTimeString=this.generalService.getTimeApplicableTO(advanceTable.locationOutTime);
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(sendEmsAndEmailID: number): Observable<any> {
    return this.httpClient.delete(this.API_URL + '/' + sendEmsAndEmailID);
  }

  getDispatchDetails(allotmentID: number): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/ForAllotmentData/' + allotmentID
    );
  }
}

