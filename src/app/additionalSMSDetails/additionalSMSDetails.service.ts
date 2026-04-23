// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdditionalSMSDetails } from './additionalSMSDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AdditionalSMSDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "additionalMessaging";
  }
  /** CRUD METHODS */
  getAdditionalSmsDetails(reservationID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/ForAdditionalMessaging/' + reservationID}`);
  }

  // add(advanceTable: AdditionalSMSDetails) 
  // {
  //   advanceTable.additionalSMSDetailsID=-1;
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  update(advanceTable: AdditionalSMSDetails)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(additionalSMSDetailsID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ additionalSMSDetailsID  + '/'+ userID);
  }

}
  

