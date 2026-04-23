// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class BillingHistoryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutySlipForBilling";
    
  }
  


  GetBillingHistoryData(DutySlipID:any,PageNumber: number)
  {
    return this.httpClient.get(this.API_URL+"/GetBillingHistoryData/"+ DutySlipID  +'/' + PageNumber + '/DutySlipForBillingID/Ascending');
  }

}
  

