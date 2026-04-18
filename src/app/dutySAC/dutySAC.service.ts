// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutySACModel } from './dutySAC.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutySACService 
{
  private API_URL:string = '';
   private API_URL1:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutySAC";
    this.API_URL1=generalService.BaseURL+ "dutySACClosing";
  }
  /** CRUD METHODS */
  getTableData(dutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" + dutySlipID);
  }
   getTableDataforClosing(allotmentID: number): Observable<any> {
        return this.httpClient.get(this.API_URL1 + '/dutySACClosing/' + allotmentID);
    }
  
  //   getTableDataforClosing(allotmentID: number):  Observable<any> 
  // {
  //   return this.httpClient.get(this.API_URL1 + "/" + allotmentID);
  // }
  getTableDataSort(dutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" + dutySlipID);
  }

  add(advanceTable: DutySACModel) 
  {
    advanceTable.dutySACID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.changeDateTimeString=this.generalService.getTimeApplicable(advanceTable.changeDateTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DutySACModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.changeDateTimeString=this.generalService.getTimeApplicable(advanceTable.changeDateTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(dutySACID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ dutySACID+ '/'+ userID);
  }

}
  

