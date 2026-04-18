// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { MOPModel } from './mopDetailsShow.model';
@Injectable()
export class MOPDetailsService 
{
  private API_URL:string = '';
  private API_URL_ForMOPEdit:string='';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservation";
    this.API_URL_ForMOPEdit=generalService.BaseURL+ "reservation" + "/updateModeOfPaymentForReservation/";
  }
  /** CRUD METHODS */
  getModeOfPaymentDetails(reservationID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/getPaymentMode/' + reservationID);
  }

  update(advanceTable: MOPModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL_ForMOPEdit , advanceTable);
  }
  
}
  

