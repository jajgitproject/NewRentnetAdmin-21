// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IntegrationLog } from './integrationLog.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class IntegrationLogService 
{
  private API_URL:string = '';
  private RESEND_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "controlPanel/";
    this.RESEND_API_URL=generalService.BaseURL+ "resendIntegrationLog";
  }
  /** CRUD METHODS */

  GetIntegrationLogData(reservationID :number): Observable<IntegrationLog>{
      return this.httpClient.get<IntegrationLog>(this.API_URL + "Apilog/" + reservationID);
  }

  resendApi(payload: any) {
    return this.httpClient.post(this.RESEND_API_URL, payload);
  }
}
  

