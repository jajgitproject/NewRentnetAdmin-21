// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { Reservation } from '../reservation/reservation.model';
import { LifeCycleStatus } from './lifeCycleStatus.model';
@Injectable()
export class LifeCycleStatusService
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservation";
  }
  /** CRUD METHODS */

  getlifeCycleStatus(reservationID: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/ForLifeCycleStatusDetails/${reservationID}`);
  }
  // getlifeCycleStatus(reservationID: number): Observable<LifeCycleStatus[]> {
  //   return this.httpClient.get<LifeCycleStatus[]>(`${this.API_URL}/ForLifeCycleStatusDetails/${reservationID}`);
  // }
  
}
  

