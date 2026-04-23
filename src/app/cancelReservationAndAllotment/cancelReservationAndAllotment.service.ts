// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CancelReservationAndAllotment } from './cancelReservationAndAllotment.model';
@Injectable()
export class CancelReservationAndAllotmentService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "controlPanel/CancelReservation";
  }
  /** CRUD METHODS */
 
  add(advanceTable: CancelReservationAndAllotment) 
  {
    advanceTable.allotmentID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CancelReservationAndAllotment)
  {
    
     advanceTable.cancellationByEmployeeID=this.generalService.getUserID();
     advanceTable.dateOfCancellation= this.generalService.getTodaysDate();
     advanceTable.timeOfCancellation= this.generalService.getCurrentTime();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(ReservationAllotmentID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ ReservationAllotmentID);
  }



}
  

