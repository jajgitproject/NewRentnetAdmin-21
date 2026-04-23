// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentDuty } from './currentDuty.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CurrentDutyService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "currentDuty";
  }
  /** CRUD METHODS */
  getTableData(dutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL+ '/' +dutySlipID);
  }

  getTableDataForApp(dutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL+ '/'+ 'GetDataforApp' + '/' +dutySlipID);
  }

  getTableDataForDriver(dutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL+ '/'+ 'GetDataforDriver' + '/' +dutySlipID);
  }

  getTableDataForGPS(dutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL+ '/'+ 'GetDataforGPS' + '/' +dutySlipID);
  }

  // getTableDataSort(SearchCurrentDuty:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  // {
  //   if(SearchCurrentDuty==="")
  //   {
  //     SearchCurrentDuty="null";
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus="null";
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +SearchCurrentDuty + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  // }

  // add(advanceTable: CurrentDuty) 
  // {
  //   advanceTable.currentDutyID=-1;
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  update(advanceTable: CurrentDuty)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  // delete(currentDutyID: number):  Observable<any> 
  // {
  //   return this.httpClient.delete(this.API_URL + '/'+ currentDutyID);
  // }

  
}
  

