// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdvanceDetails } from './advanceDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AdvanceDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservationAdvance";
  }
  /** CRUD METHODS */
  getTableData(ReservationID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" +ReservationID + '/' + SearchActivationStatus +'/' + PageNumber + '/ReservationAdvanceDetailsID/Ascending');
  }

  add(advanceTable: AdvanceDetails) 
  {
    advanceTable.reservationAdvanceDetailsID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.dateOfAdvanceReceivedString=this.generalService.getTimeApplicable(advanceTable.dateOfAdvanceReceived);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: AdvanceDetails)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.dateOfAdvanceReceivedString=this.generalService.getTimeApplicable(advanceTable.dateOfAdvanceReceived);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(reservationAdvanceDetailsID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ reservationAdvanceDetailsID + '/'+ userID);
  }

}
  

