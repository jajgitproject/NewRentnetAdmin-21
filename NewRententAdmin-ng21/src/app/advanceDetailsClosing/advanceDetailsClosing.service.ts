// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';

@Injectable()
export class AdvanceDetailsClosingService 
{
  private API_URL_Closing:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {

    this.API_URL_Closing=generalService.BaseURL+ "advanceDetailsClosing";
  }
  /** CRUD METHODS */


  
 getTableData(ReservationID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Closing + "/" +ReservationID + '/' + SearchActivationStatus +'/' + PageNumber + '/ReservationAdvanceDetailsID/Ascending');
  }
}
  

