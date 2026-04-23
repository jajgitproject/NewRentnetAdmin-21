// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { DutyState } from './dutyState.model';
@Injectable()
export class DutyStateService 
{
  private API_URL:string = '';
  private API_URL_Closing:string = '';
  private API_URL_City:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyState";
    this.API_URL_Closing=generalService.BaseURL+ "dutyStateClosing";
    this.API_URL_City=generalService.BaseURL+ "city/GetEcoDutyStateForClosing";
  }
  /** CRUD METHODS */
  getTableData(dutySlipID:number):  Observable<any> 
  {
   
    return this.httpClient.get(this.API_URL + "/" + dutySlipID );
  }
  // getTableDataSort(SearchBank:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  // {
  //   if(SearchBank==="")
  //   {
  //     SearchBank="null";
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus=null;
  //   }
  //   //console.log(this.API_URL + "/" +SearchBank + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
  //   return this.httpClient.get(this.API_URL + "/" +SearchBank + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  // }

  add(advanceTable:  DutyState) 
  {
    advanceTable.dutyStateID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.changeDateTimeString=this.generalService.getTimeApplicableTO(advanceTable.changeDateTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable:  DutyState)
  {
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.changeDateTimeString=this.generalService.getTimeApplicableTO(advanceTable.changeDateTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(dutyStateID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ dutyStateID+ '/'+ userID);
  }
  getTableDataClosing(dutySlipID:number):  Observable<any> 
  {
   
    return this.httpClient.get(this.API_URL_Closing + "/" + dutySlipID );
  }
   GetEcoDutyStateForClosing():  Observable<any> 
  {
   
    return this.httpClient.get(this.API_URL_City);
  }
}
  

