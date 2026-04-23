// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationDutyslipSearchModel } from './reservationDutyslipSearch.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ReservationDutyslipSearchService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "Closing";
  }
  /** CRUD METHODS */
  getTableData(reservationID:any, dutyslipID:any):  Observable<any> 
  {
    if(reservationID === null || reservationID === undefined || reservationID === "")
    {
      reservationID = 0;
    }
    if(dutyslipID === null || dutyslipID === undefined || dutyslipID === "")
    {
      dutyslipID = 0;
    }
    return this.httpClient.get(this.API_URL + "/GetReservationDutyslipSearchData/" + reservationID + '/' + dutyslipID);
  }
}
  

