// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PassengerHistory } from './PassengerHistory.model'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class PassengerHistoryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "passengerHistory";
  }
  /** CRUD METHODS */
  getTableData(reservationID:number, pickupCityID:number,PageNumber: number,):  Observable<any> 
  {
    const url = `${this.API_URL}/GetCompletePassengerData/${reservationID}/${pickupCityID}/${PageNumber}/reservation.ReservationID/Descending`;
    console.log(url);
    return this.httpClient.get(url);
  }

  update(advanceTable: PassengerHistory)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

}
  

