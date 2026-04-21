// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutyInterstateTaxApproval } from './dutyInterstateTaxApproval.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutyInterstateTaxApprovalService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyInterstateTax";
  }

  /** CRUD METHODS */

  LoadInterstateTaxData(InterStateTaxStartDate:string,InterStateTaxEndDate:string,RegistrationNumber:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'getInterstateTax'+ "/"+InterStateTaxStartDate+ "/"+InterStateTaxEndDate+ "/" +RegistrationNumber);
  }

  LoadDutyInterstateTax(DutySlipID:number)
  {
    return this.httpClient.get(this.API_URL + "/"+'getAllDutyInsterstateTax'+ "/"+DutySlipID);
  }

  getTableData(SearchDutyInterstateTax:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchDutyInterstateTax==="")
    {
      SearchDutyInterstateTax="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDutyInterstateTax + '/' + SearchActivationStatus +'/' + PageNumber + '/DutyInterstateTaxApproval/Ascending');
  }
  getTableDataSort(SearchDutyInterstateTax:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchDutyInterstateTax==="")
    {
      SearchDutyInterstateTax="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDutyInterstateTax + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: DutyInterstateTaxApproval) 
  {
    advanceTable.dutyInterstateTaxID=-1;
    if(advanceTable.approvalRemark === 'N/A')
    {
      advanceTable.approvalRemark = null;
    }
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.approvalDateString=this.generalService.getTimeApplicable(advanceTable.approvalDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DutyInterstateTaxApproval)
  {
    advanceTable.taxStartDateString=this.generalService.getTimeApplicable(advanceTable.taxStartDate);
    advanceTable.approvalDateString=this.generalService.getTimeApplicable(advanceTable.approvalDate);
    advanceTable.taxEndDateString=this.generalService.getTimeApplicable(advanceTable.taxEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(dutyInterstateTaxID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ dutyInterstateTaxID);
  }

}
  

