// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationClosingDetails } from './reservationClosingDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ReservationClosingDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservationDetailsForClossing";
  }
  /** CRUD METHODS */
  getTableData(allotmentID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL+'/'+'ReservationDetails/'+allotmentID);
  }

  update(advanceTable: ReservationClosingDetails)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
}
  

