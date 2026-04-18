// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class  CurrentDutyDetailsService 
{
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  private API_URL_CurrentDutyInfo:string = '';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL_CurrentDutyInfo=generalService.BaseURL+ "currentDutyDetails";
  }

  getTableDataForApp(AllotmentID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_CurrentDutyInfo+ '/'+ 'GetDataforApp' + '/' +AllotmentID);
  }

  getTableDataForDriver(AllotmentID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_CurrentDutyInfo+ '/'+ 'GetDataforDriver' + '/' +AllotmentID);
  }

  getTableDataForGPS(AllotmentID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_CurrentDutyInfo+ '/'+ 'GetDataforGPS' + '/' +AllotmentID);
  }
 
}
  

