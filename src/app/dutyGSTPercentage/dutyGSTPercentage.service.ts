// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutyGSTPercentage } from './dutyGSTPercentage.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutyGSTPercentageService 
{
  private API_URL:string = '';
  private API_URL_Closing:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyGSTPercentage";
    this.API_URL_Closing=generalService.BaseURL+ "dutyGSTPercentageClosing";
  }
  /** CRUD METHODS */
  getTableData(dutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" + dutySlipID);
  }
  getTableDataSort(dutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" + dutySlipID);
  }
   getTableDataClosing(dutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Closing + "/" + dutySlipID);
  }

  add(advanceTable: DutyGSTPercentage) 
  {
    advanceTable.dutyGSTPercentageID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.changeDateTimeString=this.generalService.getTimeApplicable(advanceTable.changeDateTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DutyGSTPercentage)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.changeDateTimeString=this.generalService.getTimeApplicable(advanceTable.changeDateTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(dutyGSTPercentageID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ dutyGSTPercentageID+ '/'+ userID);
  }

}
  

