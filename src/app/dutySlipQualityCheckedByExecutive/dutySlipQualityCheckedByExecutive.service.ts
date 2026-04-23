// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutySlipQualityCheckedByExecutive } from './dutySlipQualityCheckedByExecutive.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutySlipQualityCheckedByExecutiveService
{
  delete(dutyQualityCheckID: any) {
    throw new Error('Method not implemented.');
  }
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+"dutySlipQualityCheckByExecutive";
  }
  /** CRUD METHODS */
  getdutyQualityCheckDataDetails(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/GetDutyQualityDataCheck/' + allotmentID}`);
  }

  // getTableDataSort(dutyQualityCheckID:number,SearchVerificationResult:boolean, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  // {
  //   if(dutyQualityCheckID===0)
  //   {
  //     dutyQualityCheckID=0;
  //   }
  //   if(SearchVerificationResult===null)
  //   {
  //     SearchVerificationResult=null;
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus=null;
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +SearchVerificationResult + '/'+ dutyQualityCheckID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  // }

  update(advanceTable: DutySlipQualityCheckedByExecutive)
  {
    advanceTable.qCCheckedByExecutiveID=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.qCDateString=this.generalService.getTimeApplicable(advanceTable.qcDate);
    advanceTable.qCTimeString=this.generalService.getTimeApplicableTO(advanceTable.qcTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
 

  
}
  

