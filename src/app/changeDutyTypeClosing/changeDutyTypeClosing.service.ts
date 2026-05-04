// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { ChangeDutyTypeClosingModel } from './changeDutyTypeClosing.model';

@Injectable()
export class ChangeDutyTypeClosingService 
{
  private API_URL:string = '';
  private API_URL_ForMOPEdit:string='';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "changeDutyTypeClosing";
    this.API_URL_ForMOPEdit=generalService.BaseURL+ "reservation" + "/updateModeOfPaymentForReservation/";
  }
  /** CRUD METHODS */
  getModeOfPaymentDetails(reservationID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/getPaymentMode/' + reservationID);
  }

  update(advanceTable: ChangeDutyTypeClosingModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
}
  

