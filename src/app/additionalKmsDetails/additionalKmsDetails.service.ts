// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class  AdditionalKmsDetailsService 
{
  
  private API_DutySlipForBilling:string = '';
    private API_AdditionalKmsDetailsForClosing:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_DutySlipForBilling=generalService.BaseURL+ "dutySlipForBilling"
    this.API_AdditionalKmsDetailsForClosing=generalService.BaseURL+ "additionalKmsDetailsForClosing"
  }
  /** CRUD METHODS */
  getAdditionalKmsDetails(dutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_DutySlipForBilling + '/ForAdditionalKms/' + dutySlipID}`);
  }

    getAdditionalKmsDetailsForClosing(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_AdditionalKmsDetailsForClosing + '/ForAdditionalKmsForClosing/' + allotmentID}`);
  }

  updateAdditional(advanceTable:any)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_DutySlipForBilling+'/UpdateAdditionalKMsAndMinutes' , advanceTable);
  }
 
}
  

