// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NextDayInstruction } from './nextDayInstruction.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class NextDayInstructionService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "nextDayInstruction";
  }
  getDriverRemarkDetails(DutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/GetDriverRemarkDetails/' + DutySlipID}`);
  }
  /** CRUD METHODS */
  getTableData(SearchNextDayInstruction:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchNextDayInstruction==="")
    {
      SearchNextDayInstruction="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchNextDayInstruction + '/' + SearchActivationStatus +'/' + PageNumber + '/NextDayInstruction/Ascending');
  }
 
  add(advanceTable: NextDayInstruction) 
  {
    // advanceTable.nextDayInstructionID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: NextDayInstruction)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nextDayInstructionDateString=this.generalService.getTimeApplicable(advanceTable.nextDayInstructionDate);
    advanceTable.nextDayInstructionTimeString=this.generalService.getTimeApplicable(advanceTable.nextDayInstructionTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(nextDayInstructionID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ nextDayInstructionID);
  }

}
  

