// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutyExpenseModel } from './dutyExpense.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutyExpenseService 
{
  private API_URL:string = '';
  private API_URL_Closing:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyExpense";
    this.API_URL_Closing=generalService.BaseURL+ "dutyExpenseClosing";
  }
  /** CRUD METHODS */
  getTableData(DutySlipID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + DutySlipID + '/' + SearchActivationStatus +'/' + PageNumber + '/DutyExpenseID/Ascending');
  }
  
  getTableDataSort(SearchDutyExpense:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchDutyExpense === "")
    {
      SearchDutyExpense = "null";
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDutyExpense + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: DutyExpenseModel) 
  {
    advanceTable.dutyExpenseID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DutyExpenseModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(dutyExpenseID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ dutyExpenseID+ '/'+ userID);
  }
getTableDataClosing(DutySlipID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL_Closing + "/" + DutySlipID + '/' + SearchActivationStatus +'/' + PageNumber + '/DutyExpenseID/Ascending');
  }
  

}
  

