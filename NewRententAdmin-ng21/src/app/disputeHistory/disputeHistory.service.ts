// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DisputeHistoryService
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

  getDisputeHistoryDetails(dutySlipForBillingID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/getDisputeHistory/' + dutySlipForBillingID);
  }

}
  

